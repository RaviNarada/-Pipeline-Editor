# Pipeline Editor (DAG Builder) - Nexstem Frontend Intern Assignment

## Objective

This project is a React-based Pipeline Editor that allows users to visually create and manage a Directed Acyclic Graph (DAG). It simulates how real-time data pipelines or processing workflows are constructed using interconnected "Nodes."

## Demo

**Screen Recording & Live Demo:**
* **Demo Link:** [https://www.loom.com/share/0c68fb96de1c4b5f872e03171848512d?sid=de90997f-8ded-4cce-ab3b-b9685d324fe3](https://www.loom.com/share/0c68fb96de1c4b5f872e03171848512d?sid=de90997f-8ded-4cce-ab3b-b9685d324fe3)
* *(Optional: You can add static screenshots here as well if your Loom video is short or you want specific snapshots.)*

## Setup Instructions

To get the project up and running on your local machine:

1.  **Prerequisites:**
    * Node.js (LTS version recommended)
    * npm (Node Package Manager, comes with Node.js)

2.  **Clone the repository (or navigate to your existing project folder):**
    ```bash
    git clone https://github.com/RaviNarada/-Pipeline-Editor.git
    cd pipeline-editor
    ```
    *(If you manually created the folder, just navigate to `cd B:\Work\pipeline-editor`)*

3.  **Install Dependencies:**
    This command will read the `package.json` file and install all the necessary libraries (`react`, `reactflow`, `dagre`, `uuid`, etc.).
    ```bash
    npm install
    ```

4.  **Run the Application:**
    This will start the development server and open the application in your default web browser.
    ```bash
    npm run dev
    ```
    The application will typically open at `http://localhost:5173/`.

## Notes on Libraries Used and Key Architectural Decisions

* **React:** The core JavaScript library for building user interfaces. Utilized for its component-based architecture and declarative UI.
* **Vite:** Chosen as the build tool for its fast development server and efficient build process, providing a smooth developer experience.
* **React Flow (`reactflow`):** The primary library for graph visualization.
    * **Decision:** Selected for its native React integration, excellent documentation, and built-in features for node/edge management, handles, and interactions (`onConnect`, `onNodesChange`, `onEdgesChange`). Its extensibility allowed for custom node components.
* **Dagre (`@dagrejs/dagre`):** A JavaScript library for laying out directed graphs.
    * **Decision:** Used for the auto-layout feature. It efficiently calculates node positions to create clear, readable graph layouts (top-down or left-right). Requires converting React Flow's graph structure to Dagre's format and back.
* **UUID (`uuid`):** A library for generating universally unique IDs.
    * **Decision:** Used to ensure each new node has a unique identifier, crucial for React's keying mechanism and React Flow's internal management.

**Architectural Decisions:**

* **Component-Based Structure:** The application is broken down into smaller, reusable components (`CustomNode`, `Controls`) for better maintainability and readability.
* **Separation of Concerns:** Core logic like DAG validation (`utils/validation.js`) and graph layout (`utils/dagLayout.js`) are separated into utility files, keeping `App.jsx` focused on state management and rendering.
* **React Hooks:** Leveraged `useState` for managing graph state (`nodes`, `edges`, `isValidDag`), `useEffect` for side effects (DAG validation), and `useCallback` for optimizing function references passed to React Flow. `useReactFlow` hook was essential for accessing React Flow's instance methods like `fitView()`.
* **State Management:** `nodes` and `edges` are managed directly in `App.jsx`'s state using `useState`. For larger applications, a dedicated state management library might be considered, but for this scope, direct state management is clear and efficient.

## Challenges Faced Throughout the Assignment

Developing this application, especially as a beginner, presented several learning opportunities. Here are some key challenges and how they were addressed:

1.  **Setting up the React Environment (Initial `npm create` and `package.json` errors):**
    * **Challenge:** Encountering `EJSONPARSE` and `ETARGET` errors during `npm install` due to an incorrectly formatted `package.json` (e.g., comments in JSON, incorrect package versions).
    * **Solution:** Methodical debugging involved:
        * Ensuring `package.json` was pure JSON (no comments).
        * Verifying package versions against npm registry (e.g., changing `@vitejs/plugin-react` from a non-existent `^5.0.1` to a stable `^4.3.2`).
        * Regularly clearing the npm cache (`npm cache clean --force`) and deleting `node_modules` and `package-lock.json` for clean reinstalls. This iterative process was crucial in understanding npm's error messages.
    * **Reference:** [npm CLI Documentation](https://docs.npmjs.com/cli/v10/commands/npm-install)

2.  **JSX Parsing Errors (`.js` vs `.jsx` extensions):**
    * **Challenge:** Vite's default configuration expecting `.jsx` for files containing JSX syntax, leading to "Failed to parse source for import analysis because the content contains invalid JS syntax" errors when component files were named `.js`.
    * **Solution:** Renaming all React component files (`App.js`, `CustomNode.js`, `Controls.js`) to `.jsx` and updating their import paths (`import ... from './Component.jsx'`). This explicitly tells Vite to apply the JSX transformation.
    * **Reference:** [Vite React Plugin Documentation](https://vitejs.dev/plugins/#vitejs-plugin-react)

3.  **Implementing Robust DAG Validation (Cycle Detection):**
    * **Challenge:** The most complex part was reliably detecting cycles in the graph to ensure it's a true Directed Acyclic Graph.
    * **Solution:** Implemented a Depth-First Search (DFS) algorithm. The DFS tracks `visited` nodes (to avoid infinite loops) and `recursionStack` nodes (nodes currently being explored in the current path). If a node already in the `recursionStack` is encountered, a cycle exists.
    * **Reference:** [GeeksforGeeks - Detect Cycle in a Directed Graph](https://www.geeksforgeeks.org/detect-cycle-in-a-directed-graph-using-dfs/)

4.  **Integrating Dagre for Auto-Layout:**
    * **Challenge:** Converting React Flow's node and edge format to Dagre's expected input, and then mapping Dagre's output positions back to React Flow's coordinate system (accounting for different anchor points).
    * **Solution:** Created a utility function (`getLayoutedElements` in `utils/dagLayout.js`) to bridge the data formats. Crucially, Dagre uses a center-anchor for node positions, while React Flow uses a top-left anchor, requiring an offset (`nodeWidth / 2`, `nodeHeight / 2`) in the final position calculation. `useReactFlow().fitView()` was used to auto-zoom the graph after layout.
    * **Reference:** [React Flow Documentation - Auto Layout Example](https://reactflow.dev/examples/layouting/dagre)

5.  **Managing Edge Deletion with Node Deletion:**
    * **Challenge:** When a node is deleted, its connected edges don't automatically disappear in the state unless explicitly handled.
    * **Solution:** Utilized React Flow's `onNodesDelete` callback. Inside this callback, the `edges` state is filtered to remove any edges whose `source` or `target` ID matches a deleted node's ID.

These challenges provided valuable experience in understanding React's lifecycle, npm's ecosystem, graph theory algorithms, and integrating complex third-party libraries.