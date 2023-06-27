from django.urls import path
from rest_framework_nested import routers

from baseinfo.views import commonviews
from baseinfo.views import profileviews, importprofileviews
from baseinfo.views import expertgroupviews




router = routers.DefaultRouter()
router.register('profiles', profileviews.AssessmentProfileViewSet, basename='profiles')
router.register('questionnaires', commonviews.QuestionnaireViewSet, basename='questionnaires')
router.register('subjects', commonviews.AssessmentSubjectViewSet, basename='subjects')
router.register('attributes', commonviews.QualityAttributeViewSet, basename='attributes')
router.register('dsl', profileviews.UploadProfileApi, basename='dsl')
router.register('tags', profileviews.ProfileTagViewSet, basename='tags')
router.register('expertgroups', expertgroupviews.ExpertGroupViewSet, basename='expertgroups')


questionnaire_router = routers.NestedDefaultRouter(router, 'questionnaires', lookup='questionnaire')
questionnaire_router.register('metrics', commonviews.MetricViewSet, basename='questionnaire-metrics')

expert_group_access_router = routers.NestedDefaultRouter(router, 'expertgroups', lookup='expertgroup')
expert_group_access_router.register('expertgroupaccess', expertgroupviews.ExpertGroupAccessViewSet, basename='expertgroup-user-access')

questionnaire_by_subject_router = routers.NestedDefaultRouter(router, 'subjects', lookup='assessment_subject')
questionnaire_by_subject_router.register('questionnaires', commonviews.QuestionnaireBySubjectViewSet, basename='subject-questionnaires')


urlpatterns = router.urls + questionnaire_router.urls + questionnaire_by_subject_router.urls  + expert_group_access_router.urls

urlpatterns += [
    path("inspectprofile/<str:profile_id>/", profileviews.ProfileDetailDisplayApi.as_view()),
    path("analyzeprofile/<str:profile_id>/", profileviews.ProfileAnalyzeApi.as_view()),
    path("expertgroup/profiles/<str:expert_group_id>/", profileviews.ProfileListApi.as_view()),
    path("userexpertgroup/", expertgroupviews.UserExpertGroupsApiView.as_view()),
    path("expertgroup/unpublishedprofiles/<str:expert_group_id>/", profileviews.UnpublishedProfileListApi.as_view()),
    path("addexpertgroup/<str:expert_group_id>/", expertgroupviews.AddUserToExpertGroupApi.as_view()),
    path("expertgroup/confirm/<str:token>/", expertgroupviews.ConfirmUserForExpertGroupApi.as_view()),
    path("importprofile/", importprofileviews.ImportProfileApi.as_view()),
    path("profiles/archive/<str:profile_id>/", profileviews.ProfileArchiveApi.as_view()),
    path("profiles/publish/<str:profile_id>/", profileviews.ProfilePublishApi.as_view()),
    path("profiles/like/<str:profile_id>/", profileviews.ProfileLikeApi.as_view()),
    path("profiles/options/select/", profileviews.ProfileListOptionsApi.as_view()),
    path("profiles/update/<str:profile_id>", profileviews.UpdateProfileApi.as_view()),
    path("profiles/get/<str:profile_id>", profileviews.ProfileInitFormApi.as_view()),
    path("dsl/download/<str:profile_id>/", importprofileviews.DownloadDslApi.as_view()),
    path("assessmentsubject/assessmentkite/<str:profile_id>",commonviews.LoadAssessmentSubjectApi.as_view()),
    path("optionvalue/answertemplate/<str:answer_tamplate_id>",commonviews.LoadOptionValueApi.as_view()),
    path("levelcompetence/maturitylevel/<str:maturity_level_id>",profileviews.LoadLevelCompetenceApi.as_view()),
    path("maturitylevel/assessmentkit/<str:profile_id>",profileviews.LoadMaturityLevelApi.as_view()),
    path("metric/qualityattribute/<str:quality_attribute_id>",commonviews.LoadMetricApi.as_view()),
    path("qualityattribute/assessmentsubject/<str:assessment_subject_id>",commonviews.LoadQualityAttributeApi.as_view()),
    path("qualityattribute/assessmentsubject/assessmentkite/<str:profile_id>",commonviews.LoadAssessmentSubjectAndQualityAttributeApi.as_view()),

]