import { lazy, Suspense } from "react";
import { Route, Routes as RrdRoutes } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Redirect from "./Redirect";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import ErrorNotFoundPage from "@common/errors/ErrorNotFoundPage";
import AuthRoutes from "./AuthRoutes";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";

const SignInScreen = lazy(() => import("../screens/SignInScreen"));
const SignUpScreen = lazy(() => import("../screens/SignUpScreen"));
const UserScreen = lazy(() => import("../screens/UserScreen"));
const ActivationSuccessfulScreen = lazy(() => import("../screens/ActivationSuccessfulScreen"));

const ExpertGroupScreen = lazy(() => import("../screens/ExpertGroupScreen"));
const ExpertGroupConfirmInvitationScreen = lazy(() => import("../screens/ExpertGroupConfirmInvitationScreen"));

const AssessmentReportScreen = lazy(() => import("../screens/AssessmentReportScreen"));
const SubjectReportScreen = lazy(() => import("../screens/SubjectReportScreen"));
const SpacesScreen = lazy(() => import("../screens/SpacesScreen"));
const SpaceSettingScreen = lazy(() => import("../screens/SpaceSettingScreen"));
const AssessmentsScreen = lazy(() => import("../screens/AssessmentsScreen"));
const MetricsScreen = lazy(() => import("../screens/MetricsScreen"));
const MetricsReviewScreen = lazy(() => import("../screens/MetricsReviewScreen"));
const MetricScreen = lazy(() => import("../screens/MetricScreen"));
const QuestionnairesScreen = lazy(() => import("../screens/QuestionnairesScreen"));
const CompareScreen = lazy(() => import("../screens/CompareScreen"));
const CompareResultScreen = lazy(() => import("../screens/CompareResultScreen"));

const AssessmentKitsScreen = lazy(() => import("../screens/AssessmentKitsScreen"));
const AssessmentKitExpertViewScreen = lazy(() => import("../screens/AssessmentKitExpertViewScreen"));
const AssessmentKitScreen = lazy(() => import("../screens/AssessmentKitScreen"));

/**
 * How does it work?
 * We have two separate routes for users, for unauthorized users we have AuthRoutes and for authenticated users we use PrivateRoutes
 *
 */
const Routes = () => {
  return (
    <Suspense fallback={<GettingThingsReadyLoading />}>
      <RrdRoutes>
        {/* Handles redirecting users to where they wanted to go before login  */}
        <Route path="/" element={<Redirect />} />
        <Route
          element={
            <AuthLayout>
              <AuthRoutes />
            </AuthLayout>
          }
        >
          <Route path="/sign-in" element={<SignInScreen />} />
          <Route path="/sign-up" element={<SignUpScreen />} />
          <Route path="/account/active/:uid/:token" element={<ActivationSuccessfulScreen />} />
        </Route>

        <Route
          element={
            <AppLayout>
              <PrivateRoutes />
            </AppLayout>
          }
        >
          {/* Account related routes */}
          <Route path="/user/:accountTab" element={<UserScreen />} />
          <Route path="/user/:accountTab/:expertGroupId" element={<ExpertGroupScreen />} />
          <Route path="/user/:accountTab/:expertGroupId/assessment-kits/:assessmentKitId" element={<AssessmentKitExpertViewScreen />} />
          <Route path="/account/expert-group-invitation/:expertGroupId/:token" element={<ExpertGroupConfirmInvitationScreen />} />

          {/* Spaces and assessments related routes */}
          <Route path="/spaces" element={<SpacesScreen />} />
          <Route path="/:spaceId/setting" element={<SpaceSettingScreen />} />
          <Route path="/:spaceId/assessments" element={<AssessmentsScreen />} />
          <Route path="/:spaceId/assessments/:assessmentId/insights" element={<AssessmentReportScreen />} />
          <Route path="/:spaceId/assessments/:assessmentId/insights/:subjectId" element={<SubjectReportScreen />} />
          {/* Questionnaires and questions related routes */}
          <Route path="/:spaceId/assessments/:assessmentId/questionnaires" element={<QuestionnairesScreen />} />
          <Route
            path="/:spaceId/assessments/:assessmentId/questionnaires/:questionnaireId/review"
            element={<MetricsReviewScreen />}
          />
          <Route path="/:spaceId/assessments/:assessmentId/questionnaires/:questionnaireId" element={<MetricsScreen />}>
            <Route path="" element={<MetricScreen />} />
            <Route path=":metricIndex" element={<MetricScreen />} />
          </Route>

          {/* Assessment kits related routes */}
          <Route path="/assessment-kits" element={<AssessmentKitsScreen />} />
          <Route path="/assessment-kits/:assessmentKitId" element={<AssessmentKitScreen />} />

          {/* Compare routes */}
          <Route path="/compare" element={<CompareScreen />} />
          <Route path="/compare/result" element={<CompareResultScreen />} />
        </Route>

        {/* Any other routes results in 404 page */}
        <Route path="*" element={<ErrorNotFoundPage />} />
      </RrdRoutes>
    </Suspense>
  );
};

export default Routes;
