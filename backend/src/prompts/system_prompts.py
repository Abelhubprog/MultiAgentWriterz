"""
System prompts for the multi-agent pipeline.
"""

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    PrimaryKeyConstraint,
    func
)
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class SystemPrompt(Base):
    __tablename__ = "system_prompts"

    stage_id = Column(String(100), nullable=False)
    version = Column(Integer, nullable=False, server_default="1")
    template = Column(Text, nullable=False)
    updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        PrimaryKeyConstraint("stage_id", "version", name="pk_system_prompts"),
    )

def get_initial_prompts():
    """
    Returns a list of initial system prompts to be populated in the database.
    """
    return [
        {
            "stage_id": "INTENT",
            "template": """{{% extends "common_header.jinja" %}}
{{% block content %}}
ROLE: You read the user prompt + previews of context_docs.
GOAL: Deduce metadata for downstream planning.

Return **valid JSON**:

{
  "type": "<<essay|report|reflection|case_study|dissertation>>",
  "word_target": "<int>",
  "citation_style": "<<Harvard|APA|Vancouver|Chicago>>",
  "region": "<<UK|US|AU>>"
}

USER_PROMPT:
{{ user_prompt }}

DOC_PREVIEWS (first 120 tokens each):
{{ context_preview }}
{{% endblock %}}""",
            "version": 1,
        },
        {
            "stage_id": "PLAN",
            "template": """{{% extends "common_header.jinja" %}}
{{% block content %}}
ROLE: Academic planner.
GOAL: Draft a section outline (H2/H3) & search agenda.

Return **Markdown** outline followed by **JSON** search agenda:

```markdown
## Intro …
### Scope …
…
```

```json
[
  {"query":"“patient safety hand hygiene” site:.gov", "k":8, "stage":"SEARCH_A"},
  {"query":"systematic review pressure ulcer prevalence", "k":6, "stage":"SEARCH_B"},
  {"query":"qualitative nurses perception infection control", "k":6, "stage":"SEARCH_C"}
]
```
{{% endblock %}}""",
            "version": 1,
        },
        {
            "stage_id": "SEARCH_A",
            "template": """{{% extends "common_header.jinja" %}}
{{% block content %}}
ROLE: You are search-agent-A.
INPUTS: query="{{ query }}", k={{ k }}
GOAL: Return a JSON list of objects with the following schema: {title,url,abstract,source_type,year}
{{% endblock %}}""",
            "version": 1,
        },
        {
            "stage_id": "SEARCH_B",
            "template": """{{% extends "common_header.jinja" %}}
{{% block content %}}
ROLE: You are search-agent-B.
INPUTS: query="{{ query }}", k={{ k }}
GOAL: Return a JSON list of objects with the following schema: {title,url,abstract,source_type,year}
{{% endblock %}}""",
            "version": 1,
        },
        {
            "stage_id": "SEARCH_C",
            "template": """{{% extends "common_header.jinja" %}}
{{% block content %}}
ROLE: You are search-agent-C.
INPUTS: query="{{ query }}", k={{ k }}
GOAL: Return a JSON list of objects with the following schema: {title,url,abstract,source_type,year}
{{% endblock %}}""",
            "version": 1,
        },
        {
            "stage_id": "EVIDENCE",
            "template": """{{% extends "common_header.jinja" %}}
{{% block content %}}
ROLE: Screening librarian.
GOAL: Accept only sources that are ≤10 yr old, peer-reviewed, match word_target {{ meta.word_target }}, and required evidence_type "{{ meta.type }}".

INPUT_CANDIDATES:
{{ search_blob_json }}

Return **JSON** array `allowed_sources` with valid DOI if available.
{{% endblock %}}""",
            "version": 1,
        },
        {
            "stage_id": "WRITER",
            "template": """{{% extends "common_header.jinja" %}}
{{% block content %}}
ROLE: Academic writer (formal, 3rd person, UK English if region=UK).

CONSTRAINTS:
• Cite only from allowed_sources (use Harvard style “Author (Year)”).
• Adhere to outline.
• Word_target {{ meta.word_target }} ±5 %.
• Start each section with a topic sentence.

OUTPUT: pure Markdown, no front-matter.
{{% endblock %}}""",
            "version": 1,
        },
        {
            "stage_id": "REWRITE",
            "template": """{{% extends "common_header.jinja" %}}
{{% block content %}}
ROLE: Paraphraser to eliminate AI or plagiarism flags.

Replace **ONLY** the spans between ←START_n … ←END_n markers.

<original>
{{ flagged_chunk }}
</original>

Return **updated Markdown** for the same chunk, unchanged length ±2 %.
{{% endblock %}}""",
            "version": 1,
        },
        {
            "stage_id": "QA_1",
            "template": """{{% extends "common_header.jinja" %}}
{{% block content %}}
ROLE: Quality assessor (rubric weight {{ weight }}).

Return JSON:
{
 "score": "<0-100>",
 "issues": [
   {"span":"…excerpt…","severity":"major","comment":"…"},
   …]
}
{{% endblock %}}""",
            "version": 1,
        },
        {
            "stage_id": "QA_2",
            "template": """{{% extends "common_header.jinja" %}}
{{% block content %}}
ROLE: Quality assessor (rubric weight {{ weight }}).

Return JSON:
{
 "score": "<0-100>",
 "issues": [
   {"span":"…excerpt…","severity":"major","comment":"…"},
   …]
}
{{% endblock %}}""",
            "version": 1,
        },
        {
            "stage_id": "QA_3",
            "template": """{{% extends "common_header.jinja" %}}
{{% block content %}}
ROLE: Quality assessor (rubric weight {{ weight }}).

Return JSON:
{
 "score": "<0-100>",
 "issues": [
   {"span":"…excerpt…","severity":"major","comment":"…"},
   …]
}
{{% endblock %}}""",
            "version": 1,
        },
    ]