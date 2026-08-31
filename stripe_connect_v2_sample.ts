/**
 * ============================================================================
 * STRIPE CONNECT V2 FULL INTEGRATION SAMPLE
 * ============================================================================
 * 
 * This module demonstrates an end-to-end integration for Stripe Connect V2:
 * 1. Stripe Client Initialization with safety checks & error handling.
 * 2. V2 Connected Account Creation (Display name, contact email, configuration).
 * 3. V2 Account Onboarding via Account Links & Live Status retrieval.
 * 4. V2 Thin Webhook Event Handling for requirements & capability updates.
 * 5. Connected Account Product Management (Stripe-Account header).
 * 6. Storefront Product Listing & Direct Hosted Checkout with Application Fees.
 * 7. Platform Subscription Billing & Customer Billing Portal for V2 accounts.
 * 8. Standard V1 Webhook Handlers for Subscription lifecycle tracking.
 */

import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

// ----------------------------------------------------------------------------
// STEP 1: INITIALIZE STRIPE CLIENT
// ----------------------------------------------------------------------------
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.includes('placeholder')) {
  console.error(
    '❌ ERROR: STRIPE_SECRET_KEY is missing or invalid in environment variables.\n' +
    '   Please set STRIPE_SECRET_KEY="sk_test_..." in your .env file before running.'
  );
}

/**
 * Single global instance of StripeClient used for all requests.
 * The API version is handled automatically by the Stripe SDK.
 */
export const stripeClient = new Stripe(STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  // Let the SDK use its default API version
});

// Mock database mapping user object -> connected account ID
const userAccountDatabase: Record<string, { id: string; email: string; name: string; stripeAccountId?: string }> = {};

// ----------------------------------------------------------------------------
// STEP 2: CREATING CONNECTED ACCOUNTS (V2 API)
// ----------------------------------------------------------------------------
/**
 * Creates a connected account using Stripe V2 Core Accounts API.
 * 
 * IMPORTANT RULES FOR V2 ACCOUNTS:
 * - Do NOT pass a top-level `type` parameter (e.g. do not pass type: 'express' or 'standard').
 * - Specify identity country, dashboard type ('full'), default responsibilities, and configuration.
 */
export async function createConnectedAccountV2(userId: string, displayName: string, contactEmail: string) {
  if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.includes('placeholder')) {
    throw new Error('STRIPE_SECRET_KEY placeholder found. Please provide a valid sk_test_ key in .env');
  }

  try {
    // 1. Create account using V2 Accounts API
    const account = await (stripeClient.v2.core.accounts as any).create({
      display_name: displayName,
      contact_email: contactEmail,
      identity: {
        country: 'us',
      },
      dashboard: 'full',
      defaults: {
        responsibilities: {
          fees_collector: 'stripe',
          losses_collector: 'stripe',
        },
      },
      configuration: {
        customer: {},
        merchant: {
          capabilities: {
            card_payments: {
              requested: true,
            },
          },
        },
      },
    });

    // 2. Store mapping from local user to account ID in database
    if (userAccountDatabase[userId]) {
      userAccountDatabase[userId].stripeAccountId = account.id;
    } else {
      userAccountDatabase[userId] = {
        id: userId,
        email: contactEmail,
        name: displayName,
        stripeAccountId: account.id,
      };
    }

    console.log(`✅ [V2 CONNECT] Created connected account: ${account.id} for user ${userId}`);
    return account;
  } catch (error: any) {
    console.error('❌ [V2 CONNECT ERROR] Failed to create connected account:', error.message);
    throw error;
  }
}

// ----------------------------------------------------------------------------
// STEP 3: ONBOARDING CONNECTED ACCOUNTS & STATUS RETRIEVAL
// ----------------------------------------------------------------------------
/**
 * Generates an onboarding link for the connected account using V2 Account Links API.
 */
export async function createOnboardingLinkV2(accountId: string, returnUrl: string, refreshUrl: string) {
  try {
    const accountLink = await (stripeClient.v2.core.accountLinks as any).create({
      account: accountId,
      use_case: {
        type: 'account_onboarding',
        account_onboarding: {
          configurations: ['merchant', 'customer'],
          refresh_url: refreshUrl,
          return_url: `${returnUrl}?accountId=${accountId}`,
        },
      },
    });

    console.log(`✅ [V2 ONBOARDING] Created onboarding link for ${accountId}`);
    return accountLink.url;
  } catch (error: any) {
    console.error('❌ [V2 ONBOARDING ERROR] Failed to create account link:', error.message);
    throw error;
  }
}

/**
 * Directly queries the account status from the Stripe V2 API.
 * Never cache onboarding state in DB; always fetch live status.
 */
export async function getAccountOnboardingStatusV2(stripeAccountId: string) {
  try {
    const account = await (stripeClient.v2.core.accounts as any).retrieve(stripeAccountId, {
      include: ['configuration.merchant', 'requirements'],
    });

    const readyToProcessPayments =
      account?.configuration?.merchant?.capabilities?.card_payments?.status === 'active';

    const requirementsStatus = account.requirements?.summary?.minimum_deadline?.status;

    const onboardingComplete =
      requirementsStatus !== 'currently_due' && requirementsStatus !== 'past_due';

    return {
      accountId: stripeAccountId,
      readyToProcessPayments,
      requirementsStatus: requirementsStatus || 'complete',
      onboardingComplete,
      rawAccount: account,
    };
  } catch (error: any) {
    console.error('❌ [V2 STATUS ERROR] Failed to retrieve account status:', error.message);
    throw error;
  }
}

// ----------------------------------------------------------------------------
// STEP 4: V2 THIN WEBHOOK EVENT PARSER & HANDLER
// ----------------------------------------------------------------------------
/**
 * CLI listener command for local testing:
 * stripe listen --thin-events 'v2.core.account[requirements].updated,v2.core.account[.recipient].capability_status_updated,v2.core.account[configuration.merchant].capability_status_updated,v2.core.account[configuration.customer].capability_status_updated' --forward-thin-to http://localhost:5173/api/webhooks/v2-thin
 */
export async function handleV2ThinWebhookEvent(rawBody: string, signature: string, webhookSecret: string) {
  if (!webhookSecret || webhookSecret.includes('placeholder')) {
    console.warn('⚠️ STRIPE_WEBHOOK_SECRET is not set. Skipping signature check for thin event parsing.');
  }

  try {
    // 1. Parse thin event payload
    const thinEvent = (stripeClient as any).parseThinEvent(rawBody, signature, webhookSecret);

    // 2. Fetch full event details from V2 API using thinEvent.id
    const event = await (stripeClient.v2.core.events as any).retrieve(thinEvent.id);

    console.log(`📩 [V2 THIN WEBHOOK] Received event ${event.id} of type: ${event.type}`);

    // 3. Dispatch based on event type
    switch (event.type) {
      case 'v2.core.account[requirements].updated': {
        const accountId = event.related_object?.id;
        console.log(`⚠️ Account requirements updated for: ${accountId}`);
        // Fetch fresh requirements status directly from V2 accounts API
        if (accountId) {
          const status = await getAccountOnboardingStatusV2(accountId);
          console.log(`   └─ Updated Onboarding Complete Status: ${status.onboardingComplete}`);
        }
        break;
      }
      case 'v2.core.account[configuration.merchant].capability_status_updated':
      case 'v2.core.account[configuration.customer].capability_status_updated': {
        const accountId = event.related_object?.id;
        console.log(`💳 Account capability status updated for: ${accountId}`);
        break;
      }
      default:
        console.log(`ℹ️ Unhandled V2 thin event type: ${event.type}`);
    }

    return { received: true, eventId: event.id, type: event.type };
  } catch (error: any) {
    console.error('❌ [V2 THIN WEBHOOK ERROR]:', error.message);
    throw error;
  }
}

// ----------------------------------------------------------------------------
// STEP 5: CREATING PRODUCTS ON CONNECTED ACCOUNTS
// ----------------------------------------------------------------------------
/**
 * Creates a Stripe Product directly on the connected account using the Stripe-Account header.
 */
export async function createConnectedAccountProduct(
  accountId: string,
  name: string,
  description: string,
  priceInCents: number,
  currency: string = 'usd'
) {
  try {
    // Pass { stripeAccount: accountId } to set the Stripe-Account HTTP header
    const product = await stripeClient.products.create(
      {
        name: name,
        description: description,
        default_price_data: {
          unit_amount: priceInCents,
          currency: currency,
        },
      },
      {
        stripeAccount: accountId, // Sets Stripe-Account header
      }
    );

    console.log(`✅ [PRODUCT CREATED] Created product "${name}" (${product.id}) on connected account ${accountId}`);
    return product;
  } catch (error: any) {
    console.error(`❌ [PRODUCT CREATION ERROR] Failed on ${accountId}:`, error.message);
    throw error;
  }
}

// ----------------------------------------------------------------------------
// STEP 6: DISPLAYING PRODUCTS & PROCESSING DIRECT CHARGES
// ----------------------------------------------------------------------------
/**
 * Fetches active storefront products from the connected account.
 * NOTE: Production apps should map custom domain slugs to account IDs instead of exposing raw IDs in URLs.
 */
export async function getConnectedAccountProducts(accountId: string) {
  try {
    const products = await stripeClient.products.list(
      {
        limit: 20,
        active: true,
        expand: ['data.default_price'],
      },
      {
        stripeAccount: accountId, // Sets Stripe-Account header
      }
    );

    return products.data;
  } catch (error: any) {
    console.error(`❌ [PRODUCT LIST ERROR] Failed to fetch products for ${accountId}:`, error.message);
    throw error;
  }
}

/**
 * Processes a Direct Charge with an Application Fee using Hosted Checkout.
 */
export async function createDirectChargeCheckoutSession(
  accountId: string,
  priceIdOrData: any,
  applicationFeeAmountInCents: number,
  successUrl: string
) {
  try {
    const session = await stripeClient.checkout.sessions.create(
      {
        line_items: [
          typeof priceIdOrData === 'string'
            ? { price: priceIdOrData, quantity: 1 }
            : { price_data: priceIdOrData, quantity: 1 },
        ],
        payment_intent_data: {
          // Application fee collected by platform
          application_fee_amount: applicationFeeAmountInCents,
        },
        mode: 'payment',
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      },
      {
        stripeAccount: accountId, // Direct Charge header
      }
    );

    console.log(`✅ [DIRECT CHECKOUT] Created checkout session ${session.id} for account ${accountId}`);
    return session;
  } catch (error: any) {
    console.error(`❌ [DIRECT CHECKOUT ERROR] Failed for account ${accountId}:`, error.message);
    throw error;
  }
}

// ----------------------------------------------------------------------------
// STEP 7: CHARGING PLATFORM SUBSCRIPTIONS TO CONNECTED ACCOUNTS
// ----------------------------------------------------------------------------
/**
 * Creates a Platform Subscription Checkout Session targeting the connected account.
 * Note: In V2 accounts, the connected account ID (acct_...) acts as the customer_account ID.
 */
export async function createPlatformSubscriptionSession(
  connectedAccountId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const session = await stripeClient.checkout.sessions.create({
      customer_account: connectedAccountId, // V2 Account ID (acct_...)
      mode: 'subscription',
      line_items: [
        {
          price: priceId || process.env.PRICE_ID || 'price_placeholder',
          quantity: 1,
        },
      ],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    console.log(`✅ [PLATFORM SUB SESSION] Created subscription session ${session.id} for customer_account: ${connectedAccountId}`);
    return session;
  } catch (error: any) {
    console.error(`❌ [PLATFORM SUB ERROR] Failed for ${connectedAccountId}:`, error.message);
    throw error;
  }
}

/**
 * Creates a Billing Portal Session allowing connected account owners to manage their platform subscription.
 */
export async function createAccountBillingPortalSession(connectedAccountId: string, returnUrl: string) {
  try {
    const session = await stripeClient.billingPortal.sessions.create({
      customer_account: connectedAccountId, // V2 Account ID (acct_...)
      return_url: returnUrl,
    });

    console.log(`✅ [BILLING PORTAL] Created portal session for customer_account: ${connectedAccountId}`);
    return session;
  } catch (error: any) {
    console.error(`❌ [BILLING PORTAL ERROR] Failed for ${connectedAccountId}:`, error.message);
    throw error;
  }
}

// ----------------------------------------------------------------------------
// STEP 8: STANDARD V1 SUBSCRIPTION WEBHOOK HANDLERS
// ----------------------------------------------------------------------------
/**
 * Handles standard non-thin webhook events for subscription lifecycles.
 */
export async function handleStandardSubscriptionWebhook(event: Stripe.Event) {
  const eventType = event.type;
  console.log(`📩 [V1 WEBHOOK] Processing event ${event.id} of type: ${eventType}`);

  switch (eventType) {
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      // V2 Accounts store the account ID under customer_account (shape acct_...)
      const accountId = (subscription as any).customer_account || subscription.customer;
      const currentPriceId = subscription.items.data[0]?.price?.id;
      const currentQuantity = subscription.items.data[0]?.quantity;
      const isCanceledAtPeriodEnd = subscription.cancel_at_period_end;
      const pauseCollection = subscription.pause_collection;

      console.log(`📊 Subscription updated for account: ${accountId}`);
      console.log(`   ├─ Current Price ID: ${currentPriceId}`);
      console.log(`   ├─ Quantity: ${currentQuantity}`);
      console.log(`   ├─ Cancel at period end: ${isCanceledAtPeriodEnd}`);
      console.log(`   └─ Pause Collection: ${pauseCollection ? pauseCollection.resumes_at : 'Active'}`);

      // TODO: Update subscription status and tier access in your database
      // e.g.: await db.users.update({ stripeAccountId: accountId }, { subscriptionTier: currentPriceId });
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const accountId = (subscription as any).customer_account || subscription.customer;

      console.log(`🚫 Subscription canceled/deleted for account: ${accountId}`);
      // TODO: Revoke customer/connected account access in database
      // e.g.: await db.users.update({ stripeAccountId: accountId }, { subscriptionActive: false });
      break;
    }

    case 'payment_method.attached': {
      const paymentMethod = event.data.object as Stripe.PaymentMethod;
      console.log(`💳 Payment method ${paymentMethod.id} attached to customer ${paymentMethod.customer}`);
      break;
    }

    case 'payment_method.detached': {
      const paymentMethod = event.data.object as Stripe.PaymentMethod;
      console.log(`🗑️ Payment method ${paymentMethod.id} detached`);
      break;
    }

    case 'customer.updated': {
      const customer = event.data.object as Stripe.Customer;
      const defaultPaymentMethod = customer.invoice_settings?.default_payment_method;
      console.log(`👤 Customer ${customer.id} updated. Default PM: ${defaultPaymentMethod}`);
      break;
    }

    case 'customer.tax_id.created':
    case 'customer.tax_id.updated':
    case 'customer.tax_id.deleted': {
      const taxId = event.data.object as Stripe.TaxId;
      console.log(`🏛️ Customer Tax ID event [${eventType}]: ${taxId.id}`);
      break;
    }

    case 'billing_portal.configuration.created':
    case 'billing_portal.configuration.updated':
    case 'billing_portal.session.created': {
      console.log(`⚙️ Billing portal event [${eventType}] processed.`);
      break;
    }

    default:
      console.log(`ℹ️ Event type ${eventType} handled without custom DB mutation.`);
  }

  return { received: true, eventId: event.id };
}
