<div align="center">
  <img src="./iconHigh.png" width="128" height="128" alt="LeetDraw Logo" />
  <h1>LeetDraw</h1>
  <p><b>An intuitive canvas overlay tool to sketch algorithms, map data structures, and dry-run matrices directly inside your favorite competitive coding environments.</b></p>
</div>

</br>
</br>

LeetDraw is a lightweight, powerful browser extension designed for competitive programmers and developers. It injects an intuitive digital whiteboard overlay directly onto major coding platforms, allowing you to sketch algorithms, map out data structures, create dynamic execution tables, and visualize complex logic right alongside your code editor.

No more switching between tabs or looking for physical scratch paper. Brainstorm, draw, and code all in one view.

---

## Supported Platforms

LeetDraw seamlessly activates on the following platforms:
* [**LeetCode**](https://leetcode.com/)
* [**CodeWars**](https://www.codewars.com/)
* [**HackerRank**](https://www.hackerrank.com/challenges/*)
* [**CodeChef**](https://www.codechef.com/problems/*)

---

## Features & Toolkit

The extension injects a sleek, modern toolbar at the bottom of your workspace equipped with your exact visualization toolkit:

* ![](https://custom-icon-badges.demolab.com/badge/-333333?logo=edit-2&logoColor=white&logoSource=feather) Freehand drawing for quick diagrams, trees, and graphs.
* ![](https://custom-icon-badges.demolab.com/badge/-333333?logo=trash-2&logoColor=white&logoSource=feather) Precise stroke erasing to modify your sketches.
* ![](https://custom-icon-badges.demolab.com/badge/-333333?logo=minus&logoColor=white&logoSource=feather) Draw straight structural connections cleanly.
* ![](https://custom-icon-badges.demolab.com/badge/-333333?logo=arrow-up-right&logoColor=white&logoSource=feather) Perfect for linking nodes, drawing pointers, or mapping graph steps.
* ![](https://custom-icon-badges.demolab.com/badge/-333333?logo=square&logoColor=white&logoSource=feather) Frame specific logic blocks or code zones.
* ![](https://custom-icon-badges.demolab.com/badge/-333333?logo=circle&logoColor=white&logoSource=feather) Great for highlighting network hubs or tree elements.
* ![](https://custom-icon-badges.demolab.com/badge/-333333?logo=type&logoColor=white&logoSource=feather) Input typewritten variables, state values, or inline logs.
* ![](https://custom-icon-badges.demolab.com/badge/-333333?logo=target&logoColor=white&logoSource=feather) Temporary highlight beam tracking active executions.
* ![](https://custom-icon-badges.demolab.com/badge/-333333?logo=grid&logoColor=white&logoSource=feather) Dynamically generate matrix grids to easily track your multi-dimensional **Dynamic Programming (DP)** state transitions.
* ![](https://custom-icon-badges.demolab.com/badge/-333333?logo=rotate-ccw&logoColor=white&logoSource=feather) Quick state-stack navigation to rectify quick sketching slip-ups.
* ![](https://custom-icon-badges.demolab.com/badge/-333333?logo=download&logoColor=white&logoSource=feather) Captures and exports an instant workspace snapshot containing your code background overlayed with your drawings.
* ![](https://custom-icon-badges.demolab.com/badge/-333333?logo=x-circle&logoColor=white&logoSource=feather) Easily wipe the viewport completely down to a clean slate.

---

## Installation Guide (Local Development Mode)

Since LeetDraw is currently in active development and not yet hosted on the Chrome Web Store, you can easily load it locally as an unpacked extension on Chromium-based browsers (Chrome, Edge, Brave, Opera).

### Step 1: Download the Project
Clone this repository to your local machine:
```bash
git clone https://github.com/yuki-sf/LeetDraw.git
```

*(Alternatively, click **Code > Download ZIP** at the top right of this page and extract the files).*

### Step 2: Open Extensions Page
1. Open your browser and navigate to the Extensions management page:
   * **Chrome / Brave:** Type `chrome://extensions` in the URL bar
   * **Edge:** Type `edge://extensions` in the URL bar
2. Toggle the **"Developer mode"** switch on (usually found in the top right-hand corner).

### Step 3: Load the Extension
1. Click the **"Load unpacked"** button in the top left.
2. Select the project folder containing your extension files (the root folder where your `manifest.json` resides).

LeetDraw is now ready! Navigate to any supported problem link (e.g., a LeetCode problem), and the drawing canvas will appear automatically.

---

## Tech Stack

* **Frontend Framework:** HTML5 Canvas Context (2D), CSS3, JavaScript (ES6+)
* **Extension Structure:** Web Extensions Core API (Manifest V3)

---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yuki-sf/LeetDraw/issues) if you have optimization proposals or custom canvas features.

## License

This project is [MIT](LICENSE) licensed.
