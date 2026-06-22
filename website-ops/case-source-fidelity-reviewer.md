# Case Source Fidelity Reviewer

Use this reviewer before publishing or handing off any new or materially updated AIM Website case study.

The reviewer is a source-fidelity pass, not a copywriting pass. Its job is to prevent invented tools, imported facts from adjacent projects, weak task framing, and dirty media crops.

## Inputs

- User-provided case notes and markdown.
- YouTube fragment URL, transcript, downloaded video, or source frames when available.
- Existing website case code and data, usually `V3 Site Repo - aimwebsite0.5/src/components/LabW26PageV3.tsx`.
- Case media assets, usually `V3 Site Repo - aimwebsite0.5/public/assets/cases/`.
- Any user-provided screenshots, links, captions, or role descriptions.

## Required Review

1. Source map:
   - List every source used for the case.
   - Separate confirmed facts from inferred or unverified facts.
   - Do not use another project by the same person as evidence for this case.

2. Task:
   - The task must describe the original problem/request.
   - It must not be a summary of the final solution.
   - If the original task is unclear, ask the user instead of inventing one.

3. Description:
   - Compare solution/result copy against the transcript, video, notes, and screenshots.
   - Remove claims that are not supported by the source.
   - Keep the structure understandable: task, solution, tools, result, and media should not contradict each other.

4. Technologies:
   - List only tools explicitly named in the exact case sources or directly visible in the case media.
   - Do not include WHOOP, WOOP, Plaid, PostgreSQL, Tmux, GitHub, GitLab, hardware, wearables, or infrastructure tools unless they are evidenced for this exact case.
   - If a tool appears only in an adjacent personal project or another part of the same talk, exclude it.
   - If a tool appears only in prehistory, background, a Personal OS, or a side project, do not place it in visible `tools` for the current case; either omit it, keep it as a background note, or ask the user.
   - Sort tools for humans: AI models/products and user-facing tools first, code/repository tools next, infrastructure/storage/runtime tools later, hardware/wearables last.

5. YouTube screenshots:
   - If a YouTube fragment exists, use relevant video frames for screenshots whenever possible.
   - Product screenshots must show the actual product, workflow, UI, document, board, graph, or artifact from the case.
   - Do not use a speaker intro, talking-head frame, portrait, or the first visible frame of the fragment as a product screenshot.
   - If the product is demonstrated during a video call, keep the speaker webcam thumbnail in the product screenshot as part of the case context.
   - It is acceptable for the webcam thumbnail to overlap part of the product screenshot.
   - The webcam thumbnail may be cropped separately and repositioned only if it sits on empty background or another otherwise disposable area that should be cropped away; do not generate or reconstruct product UI behind it.
   - Scrub through the fragment beyond the intro before deciding there is no product frame; if no product/workflow frame exists, do not add a product screenshot and ask the user if needed.
   - If the source video does not show the product/workflow at all, do not add a product screenshot.
   - Crop to the meaningful product or workflow area.
   - Remove browser chrome, OS menu bars, docks, player controls, timeline bars, unrelated captions, and computer UI unless those elements are the subject of the case.
   - Do not keep blurry or partially irrelevant frames when a clearer frame exists.

6. Speaker portrait:
   - If the case needs a person image, crop it separately from the YouTube fragment.
   - Keep the speaker readable and not visibly cut off.
   - Do not reuse a product screenshot crop as a portrait if it cuts the speaker badly.

## Output Template

Return a short reviewer note before handoff:

```text
Case Source Fidelity Review
Sources checked:
- ...

Confirmed task:
- ...

Technologies kept:
- ...

Technologies removed or left out:
- ...

Media checked:
- Screenshots:
- Speaker portrait:

Open questions:
- ...
```

If there are no open questions, write `Open questions: none`.

## Blockers

Do not approve handoff if:

- the task is unsupported by the source;
- the technology list contains unsupported tools;
- YouTube screenshots include avoidable browser/player/OS UI;
- the speaker portrait is visibly cut off and a better frame can be extracted;
- description, result, and media contradict each other.
