import { supabase } from '../supabaseClient';

export interface CrmContact {
  id: string;
  whitelabel_id?: string | null;
  creator_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  phone?: string | null;
  source?: string | null;
  custom_fields?: any;
}

/**
 * Syncs a CRM contact to any configured and active external CRM systems
 * (e.g. GoHighLevel, HubSpot, Zapier webhooks).
 */
export async function syncContactToExternalCrms(contact: CrmContact) {
  try {
    // 1. Fetch active integrations configured for either this specific creator profile
    // OR the network whitelabel config context.
    const { data: integrations, error: fetchErr } = await supabase
      .from('crm_integrations')
      .select('*')
      .eq('is_active', true);

    if (fetchErr) {
      console.error('Error fetching CRM integrations for sync:', fetchErr);
      return;
    }

    // Filter relevant integrations for this specific channel or network
    const filteredIntegrations = (integrations || []).filter(item => 
      (contact.creator_id && item.creator_id === contact.creator_id) ||
      (contact.whitelabel_id && item.whitelabel_id === contact.whitelabel_id)
    );

    if (filteredIntegrations.length === 0) {
      console.log('No active CRM integrations found for contact sync.');
      return;
    }

    for (const integration of filteredIntegrations) {
      const { provider_name, credentials, id: integrationId } = integration;
      const apiKey = credentials?.apiKey;

      if (!apiKey) continue;

      let success = false;
      let errorMessage = '';
      let payload: any = {};

      try {
        if (provider_name === 'zapier' || provider_name === 'webhook') {
          // Send raw webhook POST request
          payload = {
            event: 'contact.created',
            timestamp: new Date().toISOString(),
            contact: {
              id: contact.id,
              first_name: contact.first_name || '',
              last_name: contact.last_name || '',
              email: contact.email,
              phone: contact.phone || '',
              source: contact.source || 'vibe_built_in',
              custom_fields: contact.custom_fields || {}
            }
          };

          const response = await fetch(apiKey, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          success = response.ok;
          if (!success) {
            errorMessage = `Webhook API returned status: ${response.status}`;
          }
        } 
        else if (provider_name === 'gohighlevel') {
          // GoHighLevel Contacts API v2
          payload = {
            firstName: contact.first_name || '',
            lastName: contact.last_name || '',
            email: contact.email,
            phone: contact.phone || undefined,
            source: contact.source || 'Vibe Platform'
          };

          const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'Version': '2021-04-15'
            },
            body: JSON.stringify(payload)
          });
          success = response.ok;
          if (!success) {
            const errJson = await response.json().catch(() => ({}));
            errorMessage = errJson?.message || `GHL API returned status: ${response.status}`;
          }
        } 
        else if (provider_name === 'hubspot') {
          // HubSpot Contacts API v3
          payload = {
            properties: {
              firstname: contact.first_name || '',
              lastname: contact.last_name || '',
              email: contact.email,
              phone: contact.phone || '',
              hs_lead_status: 'NEW'
            }
          };

          const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
          });
          success = response.ok;
          if (!success) {
            const errJson = await response.json().catch(() => ({}));
            errorMessage = errJson?.message || `HubSpot API returned status: ${response.status}`;
          }
        }

        // Log the sync history to crm_sync_logs
        await supabase.from('crm_sync_logs').insert({
          integration_id: integrationId,
          direction: 'outbound',
          status: success ? 'success' : 'failed',
          payload,
          error_message: success ? null : errorMessage
        });

      } catch (err: any) {
        console.error(`CRM Sync error for provider ${provider_name}:`, err);
        await supabase.from('crm_sync_logs').insert({
          integration_id: integrationId,
          direction: 'outbound',
          status: 'failed',
          payload,
          error_message: err.message || 'Network error'
        });
      }
    }
  } catch (globalErr: any) {
    console.error('Unhandled global CRM sync error:', globalErr);
  }
}
