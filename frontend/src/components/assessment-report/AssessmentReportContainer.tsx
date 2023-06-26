import { Avatar, Box, CardHeader, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import QueryData from "@common/QueryData";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { AssessmentSubjectList } from "./AssessmentSubjectList";
import { useServiceContext } from "@providers/ServiceProvider";
import { AssessmentOverallStatus } from "./AssessmentOverallStatus";
import { AssessmentMostSignificantAttributes } from "./AssessmentMostSignificantAttributes";
import LoadingSkeletonOfAssessmentReport from "@common/loadings/LoadingSkeletonOfAssessmentReport";
import AssessmentReportTitle from "./AssessmentReportTitle";
import { IAssessmentReportModel } from "@types";
import QuestionnairesNotCompleteAlert from "../questionnaires/QuestionnairesNotCompleteAlert";
import { Trans } from "react-i18next";
import { styles } from "@styles";

const AssessmentReportContainer = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const queryData = useQuery<IAssessmentReportModel>({
    service: (args, config) =>
      service.fetchAssessment({ assessmentId }, config),
    toastError: true,
    toastErrorOptions: { filterByStatus: [404] },
  });

  return (
    <QueryData
      {...queryData}
      renderLoading={() => <LoadingSkeletonOfAssessmentReport />}
      render={(data) => {
        const {
          assessment_project,
          status,
          most_significant_weaknessness_atts,
          most_significant_strength_atts,
          subjects_info = [],
          total_progress,
          level_value,maturity_level_status,
          maturity_level_number
        } = data || {};
        const colorCode = assessment_project?.color?.color_code || "#101c32";
        const isComplete = total_progress.progress === 100;
        const { assessment_assessment_kit } = assessment_project || {};
        const { expert_group } = assessment_assessment_kit || {};

        return (
          <Box m="auto" pb={3} maxWidth="1440px">
            <AssessmentReportTitle data={data} colorCode={colorCode} />
            {!isComplete && (
              <Box mt={3}>
                <QuestionnairesNotCompleteAlert
                  progress={total_progress.progress}
                  to="./../questionnaires"
                  q={total_progress.total_metric_number}
                  a={total_progress.total_answered_metric_number}
                />
              </Box>
            )}
            <Box mt={3}>
              <Paper elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
                <Box
                  py={2}
                  sx={{
                    px: 3,
                    ...styles.centerV,
                    flexDirection: { xs: "column" },
                  }}
                >
                  <Box
                    sx={{
                      ...styles.centerCV,
                      textDecoration: "none",
                    }}
                    alignSelf="stretch"
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: {
                          xs: "1rem",
                          sm: "1.1rem",
                          md: "1.3rem",
                          fontFamily: "Roboto",
                        },
                        marginBottom:"6px",
                        fontWeight: "bold",
                        textDecoration: "none",
                        height: "100%",
                        display: {xs:"block",sm:"block",md:"flex",lg:"flex"},
                        alignItems: "center",
                        alignSelf: "stretch",
                      }}
                    >
                      <Trans i18nKey="theAssessmentKitUsedInThisAssessmentIs" />{" "}
                      <Box
                        component={Link}
                        to={`/assessment-kits/${assessment_assessment_kit?.id}`}
                        sx={{
                          color: (t) => t.palette.primary.dark,
                          textDecoration: "none",
                          ml: 0.5,
                        }}
                      >
                        {assessment_assessment_kit?.title}
                      </Box>
                    </Typography>
                    <Typography color="GrayText" variant="body2">
                      {assessment_assessment_kit?.summary}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      ml: "auto",
                      // mr: 2,
                      textDecoration: "none",
                    }}
                    component={Link}
                    to={`/user/expert-groups/${expert_group?.id}`}
                  >
                    <Typography
                      color="grayText"
                      variant="subLarge"
                      sx={{ fontSize: { xs: "0.6rem", md: "0.8rem" } }}
                    >
                      <Trans i18nKey="providedBy" />
                    </Typography>
                    <CardHeader
                      sx={{ p: 0, ml: 1.8 }}
                      titleTypographyProps={{
                        sx: { textDecoration: "none" },
                      }}
                      avatar={
                        <Avatar
                        sx={{width:{xs:30,sm:40},height:{xs:30,sm:40}}}
                          alt={expert_group?.name}
                          src={expert_group?.picture || "/"}
                        />
                      }
                      title={
                        <Box
                          component={"b"}
                          sx={{ fontSize: { xs: "0.6rem", md: "0.95rem" } }}
                          color="Gray"
                        >
                          {expert_group?.name}
                        </Box>
                      }
                    />
                  </Box>
                </Box>
              </Paper>
            </Box>
            <Grid container spacing={3} columns={14} mt={0.2}>
              <Grid item lg={8} md={14} sm={14} xs={14}>
                <AssessmentOverallStatus
                  status={status}
                  subjects_info={subjects_info}
                  level_value={level_value}
                  maturity_level_status={maturity_level_status}
                  maturity_level_number={maturity_level_number}
                />
              </Grid>
              <Grid item lg={3} md={7} sm={14} xs={14}>
                <AssessmentMostSignificantAttributes
                  isWeakness={false}
                  most_significant_items={most_significant_strength_atts}
                />
              </Grid>
              <Grid item lg={3} md={7} sm={14} xs={14}>
                <AssessmentMostSignificantAttributes
                  isWeakness={true}
                  most_significant_items={most_significant_weaknessness_atts}
                />
              </Grid>
              <Grid item sm={14} xs={14} id="subjects">
                <AssessmentSubjectList
                  subjects={subjects_info}
                  colorCode={colorCode}
                />
              </Grid>
            </Grid>
          </Box>
        );
      }}
    />
  );
};

export default AssessmentReportContainer;
