# SECTION_ARCHITECTURE

The homepage is one composition, not fourteen independent blocks. Every section has to
answer four questions or it does not ship.

## The narrative

| # | Section | Register | What the reader learns | Transition into the next |
| --- | --- | --- | --- | --- |
| 01 | **Hero** | paper | Who we are, what we do, that this studio has taste | Scroll cue draws down into the strip; hero media parallaxes *behind* the strip |
| 02 | **SignalStrip** | cobalt | The nine disciplines, at a glance, as a texture | Hard cut — the only one on the page, and it lands because it is earned |
| 03 | **CampaignGrid** | paper | The work looks like this | Last cell's metadata rail continues as the rule that opens 04 |
| 04 | **EditorialMonolith** | paper + texture | How we think about craft | Texture plate darkens toward the ink field of 05 |
| 05 | **Statement** *(replaces Comeback)* | ink | The point of view, in three beats | Ink field releases upward into paper — the inversion resolves |
| 06 | **Proof** *(Stats)* | paper-deep | It works, and here is the shape of it | Rule under the numbers carries into the services list |
| 07 | **ServicesList** | paper | Nine disciplines, one team | Last row's border is the top border of the work section |
| 08 | **WorkPreview** | paper | Named work, with outcomes | Portrait image continues under the video band |
| 09 | **VideoSection** | ink, full-bleed | The film register | Ink releases into the about composition |
| 10 | **AboutBlock** | paper | Who is actually doing this | Portrait rail steps down into the quote |
| 11 | **Testimonials** | paper-deep | Someone else says it | Quiet band before the client marquee |
| 12 | **Marquee** | paper | Who we have done it for | Hairline into the close |
| 13 | **FinalCTA** | ink, full-bleed | The ask | Footer is *inside* this register — no separate admin screen |
| 14 | **Footer** | ink | Where to go next | — |

## What changed from baseline

- **`Comeback` (5.2 screens of pinned blue) → `Statement` (1.4 screens).** Same intent,
  a quarter of the scroll. It is now the page's single dark inversion and it means
  something, instead of being a words-fly-around demo.
- **Second `SignalStrip` removed.** Repeating the device halves its force.
- **`Newsletter` folded into the footer register.** A standalone newsletter band between
  the CTA and the footer broke the ending.
- **Footer inherits the CTA's ink field.** Baseline ended on a four-column sitemap on
  paper, which reads as an admin screen after a cinematic page. Now the close is one
  continuous dark movement: statement → contact → sitemap → colophon.
- **Register alternation is now deliberate**: paper · cobalt · paper · paper · **ink** ·
  paper-deep · paper · paper · **ink** · paper · paper-deep · paper · **ink**. Three dark
  moments, evenly spaced, each one earning the next stretch of paper.

## Section contract

Every section component must:

1. Use `.band` / `.band-sm` / `.band-lg` for vertical rhythm — no bespoke `py-[14vh]`.
2. Use `.edge` for the horizontal gutter, or declare itself full-bleed.
3. Own exactly one `.type-title` (or none, if it is a transition band).
4. Name its register via `data-register="paper|paper-deep|ink|cobalt"` so the nav can
   invert against it.
5. Keep headlines on `DEPTH.anchor` — the copy plane does not move.
6. Provide a mobile composition, not a narrowed desktop one.
