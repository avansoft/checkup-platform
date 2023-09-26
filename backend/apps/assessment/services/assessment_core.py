import requests
from rest_framework import status

from assessment.serializers.questionvalueserializers import LoadQuestionnaireAnswerSerializer
from assessmentplatform.settings import ASSESSMENT_URL, ASSESSMENT_SERVER_PORT
from baseinfo.models.assessmentkitmodels import AssessmentKit, MaturityLevel
from baseinfo.models.basemodels import Questionnaire
from baseinfo.models.questionmodels import Question, AnswerTemplate


def create_assessment(user, data):
    result = dict()
    if not user.spaces.filter(id=data["space_id"]).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'space_id' does not exist"}
        return result
    if not AssessmentKit.objects.filter(id=data["assessment_kit_id"]).filter(is_active=True).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'assessment_kit_id' does not exist"}
        return result

    body = dict()
    body["spaceId"] = data["space_id"]
    body["title"] = data["title"]
    body["assessmentKitId"] = data["assessment_kit_id"]
    body["colorId"] = data["color_id"]
    response = requests.post(ASSESSMENT_URL + 'assessment-core/api/assessments', json=body)
    result["Success"] = True
    result["body"] = response
    return result


def get_assessment_list(space_id, request):
    result = dict()
    params = {'spaceId': space_id,
              'page': 0,
              'size': 10,
              }

    if not request.user.spaces.filter(id=space_id).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'space_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result

    if "size" in request.query_params:
        size = request.query_params["size"]
        params["size"] = size

    if "page" in request.query_params:
        page = request.query_params["page"]
        params["page"] = page

    response = requests.get(ASSESSMENT_URL + 'assessment-core/api/assessments', params=params)
    if response.status_code == status.HTTP_200_OK:
        data = response.json()
        items = list()
        for item in data["items"]:
            row_data = dict()
            row_data["id"] = item["id"]
            row_data["title"] = item["title"]
            row_data["last_modification_time"] = item["lastModificationTime"]
            row_data["color"] = item["color"]
            row_data["is_calculate_valid"] = item["isCalculateValid"]
            if item["maturityLevelId"] is not None:
                level = MaturityLevel.objects.get(id=item["maturityLevelId"])
                row_data["result_maturity_level"] = {"id": level.id,
                                                     "title": level.title,
                                                     "value": level.value
                                                     }
            else:
                row_data["result_maturity_level"] = None
            assessment_kit = AssessmentKit.objects.get(id=item["assessmentKitId"])
            row_data["assessment_kit"] = {"id": assessment_kit.id,
                                          "maturity_levels_count": assessment_kit.maturity_levels.count()
                                          }
            items.append(row_data)
        data["items"] = items
        result["Success"] = True
        result["body"] = data
        result["status_code"] = status.HTTP_200_OK
        return result
    result["Success"] = False
    result["body"] = response.json()
    result["status_code"] = response.status_code


def load_assessment_details_with_id(request,assessment_id):
    result = dict()
    response = requests.get(ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}')
    if response.status_code == status.HTTP_200_OK:
        data = response.json()
        if not request.user.spaces.filter(id=data["spaceId"]).exists():
            result["Success"] = False
            result["body"] = {"code": "no assessment found by this 'assessmentId'"}
            result["status_code"] = status.HTTP_400_BAD_REQUEST
            return result
        result["Success"] = True
        result["body"] = response.json()
        result["status_code"] = response.status_code
        return result
    result["Success"] = False
    result["body"] = response.json()
    result["status_code"] = response.status_code
    return result


def question_answering(request, assessments_details, serializer_data):
    data = {"assessmentId": assessments_details["assessmentId"],
            "questionnaireId": serializer_data["questionnaire_id"],
            "questionId": serializer_data["question_id"],
            "answerOptionId": serializer_data["answer_option_id"],
            }
    result = dict()
    if not Questionnaire.objects.filter(id=serializer_data["questionnaire_id"]).filter(
            assessment_kit=assessments_details["kitId"]).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'questionnaire_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result

    if not Question.objects.filter(id=serializer_data["question_id"]).filter(
            questionnaire=serializer_data["questionnaire_id"]).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'question_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result

    if not AnswerTemplate.objects.filter(id=serializer_data["answer_option_id"]).filter(
            question=serializer_data["question_id"]).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'answer_option_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result

    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessments_details["assessmentId"]}/answer-question',
        json=data)
    if response.status_code == status.HTTP_201_CREATED:
        result["Success"] = True
        result["body"] = response.json()
        result["status_code"] = response.status_code
        return result

    result["Success"] = False
    result["body"] = response.json()
    result["status_code"] = response.status_code
    return result


def get_maturity_level_calculate(request, assessments_details):
    result = dict()
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessments_details["assessmentId"]}/calculate')
    if response.status_code == status.HTTP_200_OK:
        data = response.json()
        data["maturity_level"] = data.pop("maturityLevel")
        data["maturity_level"]["index"] = data["maturity_level"].pop("level")
        data["maturity_level"].pop("levelCompetences")
        result["Success"] = True
        result["body"] = data
        result["status_code"] = response.status_code
        return result

    result["Success"] = True
    result["body"] = response.json()
    result["status_code"] = response.status_code
    return result


def get_questionnaire_answer(request, assessments_details, questionnaire_id):
    params = {"questionnaireId": questionnaire_id,
              'page': 0,
              'size': 50,
    }
    result = dict()
    if not Questionnaire.objects.filter(id=questionnaire_id).filter(
            assessment_kit=assessments_details["kitId"]).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'questionnaire_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result

    if "size" in request.query_params:
        size = request.query_params["size"]
        params["size"] = size

    if "page" in request.query_params:
        page = request.query_params["page"]
        params["page"] = page

    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessments_details["assessmentId"]}/answers', params=params)

    if response.status_code == status.HTTP_200_OK:
        response_body = response.json()
        questions_id = list()
        for item in response_body["items"]:
            questions_id.append(item["questionId"])
        questions = Question.objects.filter(id__in=questions_id)
        items = LoadQuestionnaireAnswerSerializer(questions, many=True).data
        for i in range(len(items)):
            response_item = list(filter(lambda x: x['questionId'] == items[i]["id"], response_body["items"]))[0]
            answer = list(filter(lambda x: x['id'] == response_item["answerOptionId"], items[i]["answer_option"]))[0]
            items[i]["may_not_be_applicable"] = response_item["isNotApplicable"]
            items[i]["answer"] = answer

        response_body["items"] = items
        result["Success"] = True
        result["body"] = response_body
        result["status_code"] = response.status_code
        return result

    result["Success"] = False
    result["body"] = response.json()
    result["status_code"] = response.status_code
    return result
