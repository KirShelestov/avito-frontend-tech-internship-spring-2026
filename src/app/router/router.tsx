import { createBrowserRouter } from "react-router-dom";
import AdsListPage from "../../pages/ads-list/AdsListPage";
import AdViewPage from "../../pages/ads-item/AdsItemPage";
import AdsRefactorPage from "../../pages/ads-item/AdsRefactorPage";

export const router = createBrowserRouter([
    { path: "/", element: <AdsListPage /> },
    { path: "/ads", element: <AdsListPage /> },
    { path: "/ads/:id", element: <AdViewPage /> },
    { path: "/ads/:id/edit", element: <AdsRefactorPage /> },
]);
