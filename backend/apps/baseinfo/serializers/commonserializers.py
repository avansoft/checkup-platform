from rest_framework import serializers

from baseinfo.models.basemodels import AssessmentSubject, QualityAttribute, Questionnaire
from baseinfo.models.metricmodels import AnswerTemplate, Metric, MetricImpact, OptionValue
from baseinfo.models.profilemodels import AssessmentProfile, ExpertGroup

class QuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ['id', 'code', 'title', 'index']


class QuestionnaireBySubjectSerilizer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ['id', 'code', 'title', 'total_question', 'index']
    total_question = serializers.SerializerMethodField()

    def get_total_question(self, questionnaire:Questionnaire):
        metrics = Questionnaire.objects.get(pk = questionnaire.id).metric_set.all()
        return len(metrics)


class AssessmentSubjectSerilizer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentSubject
        fields = ['id', 'code', 'title', 'description', 'index']


class MetricImpactSerilizer(serializers.ModelSerializer):
    class Meta:
        model = MetricImpact
        fields = ['id', 'level', 'quality_attribute']


class QualityAttributeSerilizer(serializers.ModelSerializer):
    class Meta:
        model = QualityAttribute
        fields = ['id', 'code', 'title', 'description', 'index']

class AnswerTemplateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = AnswerTemplate
        fields = ['id', 'caption', 'value', 'index']

class SimpleMetricSerializers(serializers.ModelSerializer):
    quality_attributes = QualityAttributeSerilizer(many=True)
    metric_impacts = MetricImpactSerilizer(many=True)
    class Meta:
        model = Metric
        fields = ['id', 'title', 'index', 'quality_attributes', 'metric_impacts']

class MetricSerilizer(serializers.ModelSerializer):
    answer_templates = AnswerTemplateSerializer(many=True)
    class Meta:
        model = Metric
        fields = ['id', 'title', 'index', 'answer_templates']

class AssessmentProfileSimpleSerilizer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentProfile
        fields = ['id', 'code', 'title', 'summary']

class ExpertGroupSimpleSerilizers(serializers.ModelSerializer):
    class Meta:
        model = ExpertGroup
        fields = ['id', 'name', 'bio', 'about']

class LoadQualityAttributeSerilizer(serializers.ModelSerializer):
    class Meta:
        model = QualityAttribute
        fields = ['id', 'code', 'title', 'description', 'assessment_subject', 'index', 'weight']


class OptionValueSerilizers(serializers.ModelSerializer):
    class Meta:
        model = OptionValue
        fields = ['id', 'option_id', 'value', 'metric_impact_id']
        


class LoadAssessmentSubjectAndQualityAttributeSerilizer(serializers.Serializer):
    assessmentSubjectIds = serializers.ListField(child=serializers.IntegerField())
    qualityAttributeIds = serializers.ListField(child=serializers.IntegerField())
