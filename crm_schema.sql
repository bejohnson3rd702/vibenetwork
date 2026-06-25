-- ==========================================
-- VIBE CRM DATABASE SCHEMA MIGRATION (PHASE 1)
-- Run this script in your Supabase SQL Editor
-- ==========================================

-- 1. Integration Settings Table
CREATE TABLE IF NOT EXISTS public.crm_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whitelabel_id UUID REFERENCES public.whitelabel_configs(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider_name VARCHAR(50) NOT NULL, -- 'gohighlevel', 'hubspot', 'salesforce', 'webhook'
    is_active BOOLEAN DEFAULT true,
    credentials JSONB NOT NULL, -- API keys, webhook URLs, access tokens
    sync_settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Contact Directory
CREATE TABLE IF NOT EXISTS public.crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whitelabel_id UUID REFERENCES public.whitelabel_configs(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    source VARCHAR(100), -- 'contact_form', 'checkout', 'booking'
    custom_fields JSONB DEFAULT '{}'::jsonb, -- Dynamic user fields
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_whitelabel_contact_email UNIQUE (whitelabel_id, email)
);

-- 3. Contact Tags
CREATE TABLE IF NOT EXISTS public.crm_contact_tags (
    contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    PRIMARY KEY (contact_id, tag)
);

-- 4. Opportunity Pipelines
CREATE TABLE IF NOT EXISTS public.crm_pipelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whitelabel_id UUID REFERENCES public.whitelabel_configs(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Deal Stages in a Pipeline
CREATE TABLE IF NOT EXISTS public.crm_pipeline_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id UUID REFERENCES public.crm_pipelines(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Individual Deal Opportunities
CREATE TABLE IF NOT EXISTS public.crm_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_id UUID REFERENCES public.crm_pipeline_stages(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    value NUMERIC(10,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'won', 'lost', 'abandoned'
    assigned_user_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Interaction Notes Log
CREATE TABLE IF NOT EXISTS public.crm_contact_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'note', 'email_sent', 'sms_sent', 'booking', 'purchase'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Integration Sync Logs
CREATE TABLE IF NOT EXISTS public.crm_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID REFERENCES public.crm_integrations(id) ON DELETE CASCADE,
    direction VARCHAR(10) NOT NULL, -- 'inbound', 'outbound'
    status VARCHAR(20) NOT NULL, -- 'success', 'failed'
    payload JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.crm_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contact_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contact_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_sync_logs ENABLE ROW LEVEL SECURITY;

-- Drop sample policies if they exist to prevent duplication errors
DROP POLICY IF EXISTS crm_integrations_policy ON public.crm_integrations;
DROP POLICY IF EXISTS crm_contacts_policy ON public.crm_contacts;
DROP POLICY IF EXISTS crm_contact_tags_policy ON public.crm_contact_tags;
DROP POLICY IF EXISTS crm_pipelines_policy ON public.crm_pipelines;
DROP POLICY IF EXISTS crm_pipeline_stages_policy ON public.crm_pipeline_stages;
DROP POLICY IF EXISTS crm_opportunities_policy ON public.crm_opportunities;
DROP POLICY IF EXISTS crm_activities_policy ON public.crm_contact_activities;
DROP POLICY IF EXISTS crm_sync_logs_policy ON public.crm_sync_logs;

-- Create Policies for Data Isolation (accessible by Profile Creator OR Whitelabel Owner)
CREATE POLICY crm_integrations_policy ON public.crm_integrations
    FOR ALL USING (
        auth.uid() = creator_id 
        OR auth.uid() IN (SELECT owner_id FROM public.whitelabel_configs WHERE id = whitelabel_id)
    );

CREATE POLICY crm_contacts_policy ON public.crm_contacts
    FOR ALL USING (
        auth.uid() = creator_id 
        OR auth.uid() IN (SELECT owner_id FROM public.whitelabel_configs WHERE id = whitelabel_id)
    );

CREATE POLICY crm_contact_tags_policy ON public.crm_contact_tags
    FOR ALL USING (
        contact_id IN (
            SELECT id FROM public.crm_contacts 
            WHERE creator_id = auth.uid() 
            OR whitelabel_id IN (SELECT id FROM public.whitelabel_configs WHERE owner_id = auth.uid())
        )
    );

CREATE POLICY crm_pipelines_policy ON public.crm_pipelines
    FOR ALL USING (
        auth.uid() = creator_id 
        OR auth.uid() IN (SELECT owner_id FROM public.whitelabel_configs WHERE id = whitelabel_id)
    );

CREATE POLICY crm_pipeline_stages_policy ON public.crm_pipeline_stages
    FOR ALL USING (
        pipeline_id IN (
            SELECT id FROM public.crm_pipelines 
            WHERE creator_id = auth.uid() 
            OR whitelabel_id IN (SELECT id FROM public.whitelabel_configs WHERE owner_id = auth.uid())
        )
    );

CREATE POLICY crm_opportunities_policy ON public.crm_opportunities
    FOR ALL USING (
        contact_id IN (
            SELECT id FROM public.crm_contacts 
            WHERE creator_id = auth.uid() 
            OR whitelabel_id IN (SELECT id FROM public.whitelabel_configs WHERE owner_id = auth.uid())
        )
    );

CREATE POLICY crm_activities_policy ON public.crm_contact_activities
    FOR ALL USING (
        contact_id IN (
            SELECT id FROM public.crm_contacts 
            WHERE creator_id = auth.uid() 
            OR whitelabel_id IN (SELECT id FROM public.whitelabel_configs WHERE owner_id = auth.uid())
        )
    );

CREATE POLICY crm_sync_logs_policy ON public.crm_sync_logs
    FOR ALL USING (
        integration_id IN (
            SELECT id FROM public.crm_integrations 
            WHERE creator_id = auth.uid() 
            OR whitelabel_id IN (SELECT id FROM public.whitelabel_configs WHERE owner_id = auth.uid())
        )
    );
