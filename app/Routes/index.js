import AuthenticatedRoutes from "./authenticated-routes.js"
import MainRoutes from "./main-routes.js"
import LegalRoutes from "./legal-routes.js"
import SafetyRoutes from "./safety-routes.js"
import MemberRoutes from "./member-routes.js"
import SocialRoutes from "./social-routes.js"
import { flatten } from "ramda"

const Routes = flatten([
  AuthenticatedRoutes,
  SocialRoutes,
  MainRoutes,
  MemberRoutes,
  SafetyRoutes,
  LegalRoutes,
])

export default Routes
