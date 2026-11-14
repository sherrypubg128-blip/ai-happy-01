# Golden Hour Passengers — ai-happy-01

An entry for make.fun's **"Make the AI judge happy"** bounty: one image,
made to make the AI judge happy.

The image is a golden retriever carrying a laughing orange kitten through a
wildflower meadow at golden hour, petals in the air, both mid-laugh. A
specific happy moment, not a stock smiley or a generic sunny scene: a small
passenger, a big patient friend, a shared run at the warmest hour of the day.

`main.ts` (Node 22, standard library only) checks the image — JPEG, at most
1 MiB, at most 1024×1024 — and writes it to `/output/entry.jpg`:

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
