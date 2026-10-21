import { createBrowserRouter } from "react-router";
import { RootLayout } from "../components/Layout";
import {
  AboutPage,
  ClientsPage,
  ContactPage,
  HomePage,
  NotFoundPage,
  ProductDetailPage,
  ProductsPage,
  ProjectsPage,
  ServicesPage,
} from "../pages/Pages";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "about", Component: AboutPage },
      { path: "products", Component: ProductsPage },
      { path: "products/:slug", Component: ProductDetailPage },
      { path: "services", Component: ServicesPage },
      { path: "projects", Component: ProjectsPage },
      { path: "clients", Component: ClientsPage },
      { path: "contact", Component: ContactPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
