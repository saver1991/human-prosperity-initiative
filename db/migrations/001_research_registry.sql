-- HPI research registry: metadata only, no participant data
CREATE TABLE IF NOT EXISTS public.research_sources (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 citation_key TEXT NOT NULL UNIQUE,
 title TEXT NOT NULL,
 source_url TEXT NOT NULL CHECK (source_url LIKE 'https://%'),
 author TEXT, publication_year INTEGER CHECK (publication_year BETWEEN 1900 AND 2200),
 category TEXT NOT NULL CHECK (category IN ('benefit_access','essential_costs','economic_opportunity','cross_cutting')),
 study_design TEXT, geography TEXT, summary TEXT, limitations TEXT,
 status TEXT NOT NULL DEFAULT 'candidate' CHECK (status IN ('candidate','screened','included','excluded')),
 reviewed_by TEXT, reviewed_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS research_sources_category_status_idx ON public.research_sources(category,status);
CREATE TABLE IF NOT EXISTS public.research_questions (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 question_key TEXT NOT NULL UNIQUE, title TEXT NOT NULL, description TEXT,
 status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed','in_review','active','completed','paused')),
 github_issue_url TEXT CHECK (github_issue_url IS NULL OR github_issue_url LIKE 'https://github.com/%'),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.source_question_links (
 source_id BIGINT NOT NULL REFERENCES public.research_sources(id) ON DELETE RESTRICT,
 question_id BIGINT NOT NULL REFERENCES public.research_questions(id) ON DELETE RESTRICT,
 PRIMARY KEY(source_id,question_id)
);
CREATE TABLE IF NOT EXISTS public.schema_migrations (version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now());
INSERT INTO public.schema_migrations (version) VALUES ('001_research_registry') ON CONFLICT (version) DO NOTHING;
