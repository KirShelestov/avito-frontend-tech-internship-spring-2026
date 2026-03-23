import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/router";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
    <MantineProvider>
        <RouterProvider router={router} />
    </MantineProvider>,
);
