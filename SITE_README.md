# Forge — Personal Gym Planner

A free, static, mobile-friendly workout planner designed for 4 upper-body-focused sessions per week with a smaller amount of hip-friendly lower-body training. No dependencies, API keys, ads, analytics, or back end.

## Features
- 7-day weekly selector (4 training days + 3 recovery days)
- 30-, 40-, or 50-minute resistance training sessions (plus your usual 20-minute cardio and 10-minute abs/mobility)
- Exercise substitutions selected per slot (machines, dumbbells, cables, bodyweight)
- Editable sets, reps, and weight (lb), with completed-exercise checklist
- Browser autosave with `localStorage`
- Named custom workout presets; save, load, and delete
- Date-stamped workout history
- Full JSON backup download/import to move between browsers/devices
- FAI-related precautions and tips (not medical advice)

## GitHub Pages deployment

In the repository, open **Settings → Pages → Build and deployment** and select **Deploy from a branch**, choose **`gh-pages`**, select **`/ (root)`**, then **Save**. The project URL will usually be `https://erosmontin.github.io/erosmontin/` if deployed from the `erosmontin/erosmontin` repository. It may take a few minutes to appear. Do not change the `main` branch: that is your GitHub profile README branch.

To use a separate new repository later, create a **public** repository (e.g. `gym-routine`), add `index.html`, `styles.css`, `app.js`, and `.nojekyll` to its root, and enable GitHub Pages under Settings → Pages.

## Data & privacy
All preferences, presets, and history are stored locally in the browser under key `forge-gym-planner-v1`. GitHub Pages hosts static code but does **not** store individual user's workouts. A private/incognito browser or cleared site storage can lose data; export a JSON backup regularly. Export files contain your workout history, so keep them private if desired.

## Caveat
FAI pain and exercise tolerance vary. The exercises are not a substitute for individualized clearance or physical therapy. Stop movements that produce sharp pinching/catching or ongoing symptom flares.