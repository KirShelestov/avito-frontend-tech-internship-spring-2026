import { createBrowserRouter } from "react-router-dom";
import AdsListPage from "../../pages/ads-list/AdsListPage";
import AdViewPage from "../../pages/ads-item/AdsItemPage";
import AdsRefactorPage from "../../pages/ads-item/AdsRefactorPage";
// mock router, need to change to dynamic
export const router = createBrowserRouter([
    { path: "/", element: <AdsListPage /> },
    { path: "/ads", element: <AdsListPage /> },
    { path: "/ads/item", element: <AdViewPage /> },
    { path: "ads/item/edit", element: <AdsRefactorPage /> },
]);
