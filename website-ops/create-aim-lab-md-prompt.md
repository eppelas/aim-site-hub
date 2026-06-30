# Create AIM Lab MD Prompt

Use `$create-aim-lab-md`.

Read `create-lab-from-md.md` completely, including the agent instruction block
between frontmatter and the first `## hero`.

Use the fresh `common_content.md` as the only source for Sanity reference IDs.
Do not invent, normalize, translate, or infer IDs.

Create or validate one Sanity-ready AIM lab Markdown file from the provided lab
brief or previous lab source.

Required inputs before generation:

- lab name/theme;
- unique lowercase Latin/digit/hyphen `slug`;
- `startDate` and `endDate` in `YYYY-MM-DD`;
- duration;
- speakers;
- cases;
- tariffs, including the confirmed `product_code` for every visible tariff;
- quotes/reviews/FAQ items or exact reference IDs from `common_content.md`;
- previous lab/source URL if this lab is an iteration.

Rules:

- frontmatter `slug` defines identity and URL; filename does not;
- dates must be `YYYY-MM-DD`;
- reference blocks may contain only exact identifiers from `common_content.md`;
- if an entity is absent from `common_content.md`, say it must be created in
  Studio and `common_content.md` re-exported, or leave the block empty only if
  the owner accepts that import behavior;
- `product_code` comes from Dan's NocoDB catalog or an explicit owner-provided
  source, never from the slug;
- `**bold**` and `*italic*` are allowed only inside text fields;
- FAQ is a flat list without categories.

Before returning the file, run the template self-check. Return the complete
Markdown file as one fenced code block.
