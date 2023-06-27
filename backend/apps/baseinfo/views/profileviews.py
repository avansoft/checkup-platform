from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet
from rest_framework.exceptions import PermissionDenied

from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated

from baseinfo.decorators import is_expert
from baseinfo.services import profileservice, expertgroupservice
from baseinfo.serializers.profileserializers import *
from baseinfo.models.profilemodels import ProfileDsl, ProfileTag, AssessmentProfile , LevelCompetence
from baseinfo.permissions import ManageExpertGroupPermission, ManageProfilePermission
from baseinfo.serializers import commonserializers
from baseinfo.services import commonservice, profileservice


class AssessmentProfileViewSet(mixins.RetrieveModelMixin,
                   mixins.DestroyModelMixin,
                   mixins.ListModelMixin,
                   GenericViewSet):
    serializer_class = AssessmentProfileSerilizer
    filter_backends=[DjangoFilterBackend, SearchFilter]
    permission_classes = [IsAuthenticated, ManageProfilePermission]
    search_fields = ['title']

    def get_queryset(self):
        if self.action == 'list':
            return AssessmentProfile.objects.filter(is_active = True)
        return AssessmentProfile.objects.all()

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        result = profileservice.is_profile_deletable(kwargs['pk'])
        if result.success:
            return super().destroy(request, *args, ** kwargs)
        else:
            return Response({'message': result.message}, status=status.HTTP_400_BAD_REQUEST)
        

class ProfileDetailDisplayApi(APIView):
    permission_classes = [IsAuthenticated, ManageProfilePermission]
    def get(self, request, profile_id):
        profile = profileservice.load_profile(profile_id)
        response = profileservice.extract_detail_of_profile(profile, request)
        return Response(response, status = status.HTTP_200_OK)

class ProfileAnalyzeApi(APIView):
    permission_classes = [IsAuthenticated, ManageProfilePermission]
    def get(self, request, profile_id):
        result = profileservice.analyze(profile_id)
        return Response(result.data, status = status.HTTP_200_OK)

class ProfileListApi(APIView):
    @is_expert
    def get(self, request, expert_group_id):
        expert_group = expertgroupservice.load_expert_group(expert_group_id)
        response = AssessmentProfileSerilizer(expert_group.profiles.filter(is_active=True), many = True, context={'request': request}).data
        return Response({'results' : response}, status = status.HTTP_200_OK)
    
class UnpublishedProfileListApi(APIView):
    permission_classes = [IsAuthenticated]
    @is_expert
    def get(self, request, expert_group_id):
        expert_group = expertgroupservice.load_expert_group(expert_group_id)
        if not expert_group.users.filter(id = request.user.id).exists():
            raise PermissionDenied
        response = AssessmentProfileSerilizer(expert_group.profiles.filter(is_active=False), many = True, context={'request': request}).data
        return Response({'results' : response}, status = status.HTTP_200_OK)

class ProfileListOptionsApi(APIView):
    def get(self, request):
        profile_options =  AssessmentProfile.objects.filter(is_active = True).values('id', 'title')
        return Response({'results': profile_options})

class ProfileArchiveApi(APIView):
    permission_classes = [IsAuthenticated, ManageProfilePermission]
    def post(self, request, profile_id):
        profile = profileservice.load_profile(profile_id)
        result = profileservice.archive_profile(profile)
        if not result.success:
            return Response({'message': result.message}, status=status.HTTP_400_BAD_REQUEST) 
        return Response({'message': result.message})

class ProfilePublishApi(APIView):
    permission_classes = [IsAuthenticated, ManageProfilePermission]
    def post(self, request, profile_id):
        profile = profileservice.load_profile(profile_id)
        result = profileservice.publish_profile(profile)
        if not result.success:
            return Response({'message': result.message}, status=status.HTTP_400_BAD_REQUEST) 
        return Response({'message': result.message})

class ProfileTagViewSet(ModelViewSet):
    serializer_class = ProfileTagSerializer
    def get_queryset(self):
        return ProfileTag.objects.all()
    
class UploadProfileApi(ModelViewSet):
    serializer_class = ProfileDslSerializer

    def get_queryset(self):
        return ProfileDsl.objects.all()

class ProfileLikeApi(APIView):
    @transaction.atomic
    def post(self, request, profile_id):
        profile = profileservice.like_profile(request.user.id, profile_id)
        return Response({'likes': profile.likes.count()})

class ProfileInitFormApi(APIView):
    permission_classes = [IsAuthenticated, ManageProfilePermission]
    def get(self, request, profile_id):
        profile = profileservice.load_profile(profile_id)
        data = profileservice.get_extrac_profile_data(profile ,request)
        response = ProfileInitFormSerilizer(data, many = True, context={'request': request}).data      
        return Response(response, status = status.HTTP_200_OK)


class UpdateProfileApi(APIView):
    serializer_class = UpdateProfileSerializer
    permission_classes = [IsAuthenticated, ManageProfilePermission]
    def post(self, request, profile_id):
        serializer = UpdateProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        result = profileservice.update_profile(profile ,request,**serializer.validated_data)
        if result.success:
            return Response({'message': result.message})
        else:
            return Response({'message': result.message}, status=status.HTTP_400_BAD_REQUEST)

class LoadLevelCompetenceApi(APIView):
    def get(self,request,maturity_level_id):
        maturity_level = commonservice.load_maturity_level(maturity_level_id)
        response = LevelCompetenceSerilizer(LevelCompetence.objects.filter(maturity_level=maturity_level_id), many = True, context={'request': request}).data
        return Response(response, status = status.HTTP_200_OK) 

class LoadMaturityLevelApi(APIView):
    def get(self,request,profile_id):
        profile = profileservice.load_profile(profile_id)
        response = MaturityLevelSimpleSerializer(MaturityLevel.objects.filter(profile=profile_id), many = True, context={'request': request}).data
        return Response(response, status = status.HTTP_200_OK) 