import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ListPage from "./components/ListPage/ListPage";
import DetailsPage from "./components/DetailsPage/DetailsPage";
import NewRequest from "./components/NewRequest/NewRequest";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/requests" replace />} />
        <Route path="/requests" element={<ListPage />} />
        <Route path="/requests/:id" element={<DetailsPage />} />
        <Route path="/new" element={<NewRequest />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
