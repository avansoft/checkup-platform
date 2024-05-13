import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Title from "@common/Title";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { getMaturityLevelColors, styles } from "@styles";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import { theme } from "@config/theme";
import { useEffect, useState } from "react";
import QueryData from "@common/QueryData";
import { useQuery } from "@utils/useQuery";
import { useParams } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import emptyPositiveState from "@assets/svg/emptyPositiveState.svg";
import emptyState from "@assets/svg/emptyState.svg";
import emptyNegativeState from "@assets/svg/emptyNegativeState.svg";
import { CircularProgress } from "@mui/material";

enum evidenceType {
  positive = "POSITIVE",
  negative = "NEGATIVE",
}

const SUbjectAttributeCard = (props: any) => {
  const {
    title,
    description,
    maturityLevel,
    maturity_levels_count,
    maturityScores,
    confidenceValue,
    id,
  } = props;
  const [expanded, setExpanded] = useState<string | false>(false);
  const [expandedAttribute, setExpandedAttribute] = useState<string | false>(
    false
  );
  const [emptyPositiveEvidence, setEmptyPositiveEvidence] =
    useState<boolean>(false);
  const [emptyNegativeEvidence, setEmptyNegativeEvidence] =
    useState<boolean>(false);
  const [positiveEvidenceLoading, setPositiveEvidenceLoading] =
    useState<boolean>(false);
  const [negativeEvidenceLoading, setNegativeEvidenceLoading] =
    useState<boolean>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAttribute(isExpanded ? panel : false);
    };
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        py: { xs: 3, sm: 4 },
        // pr: { xs: 1.5, sm: 3, md: 4 },
        mb: 5,
      }}
    >
      <Accordion
        sx={{ boxShadow: "none !important" }}
        expanded={expandedAttribute === id}
        onChange={handleChange(id)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ padding: "0 !important", alignItems: "flex-start", mr: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item md={11} xs={12}>
              <Box mb={1}>
                <Title
                  textTransform={"uppercase"}
                  fontWeight="bolder"
                  sx={{
                    opacity: 0.95,
                    letterSpacing: ".05em",
                    ml: { xs: 0.75, sm: 1.5, md: 2 },
                  }}
                  fontFamily="Roboto"
                >
                  {title}
                </Title>
              </Box>
              <AttributeStatusBarContainer
                status={maturityLevel?.title}
                ml={maturityLevel?.index}
                cl={Math.ceil(confidenceValue)}
                mn={maturity_levels_count}
              />
              <Box mt={3}>
                <Typography
                  fontSize="1.15rem"
                  fontFamily="Roboto"
                  fontWeight={"bold"}
                  sx={{ ml: { xs: 0.75, sm: 1.5, md: 2 } }}
                >
                  <Trans i18nKey={"withConfidence"} />
                  <Typography
                    component="span"
                    fontFamily="Roboto"
                    fontWeight={"bold"}
                    color="#3596A1"
                    fontSize="1.12rem"
                    mx={1}
                  >
                    {Math.ceil(confidenceValue)}%
                  </Typography>
                  <Trans
                    i18nKey={"wasEstimate"}
                    values={{ attribute: title }}
                  />
                  <Typography
                    component="span"
                    fontFamily="Roboto"
                    fontWeight={"bold"}
                    color="#6035A1"
                    fontSize="1.2rem"
                  >
                    {" "}
                    {maturityLevel?.index}.{" "}
                  </Typography>
                  <Trans i18nKey={"meaning"} /> {maturityLevel?.title}.
                </Typography>
              </Box>
              <Box mt={0.6} sx={{ ml: { xs: 0.75, sm: 1.5, md: 2 } }}>
                <Typography fontSize="1.05rem" fontFamily="Roboto">
                  {description}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </AccordionSummary>
        <Divider sx={{ mx: 2 }} />
        <AccordionDetails sx={{ padding: "0 !important" }}>
          <Typography
            variant="h4"
            mt={4}
            mb={2}
            sx={{
              gap: "46px",
              ...styles.centerVH,
            }}
          >
            <Trans i18nKey={"relatedEvidences"} />
          </Typography>
          {emptyNegativeEvidence && emptyPositiveEvidence ? (
            <Box width="100%" padding={4} gap={3} sx={{ ...styles.centerCVH }}>
              <img width="25%" src={emptyState} alt="empty" />
              <Typography variant="h5" color="#9DA7B3">
                <Trans i18nKey={"noEvidence"} />
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                ...styles.centerVH,
                gap: "46px",
                paddingX: "104px",
              }}
            >
              {/* passing loading negative evidence for displaying circular progess till both of them had been loaded */}
              <RelatedEvidencesContainer
                expandedAttribute={expandedAttribute}
                attributeId={id}
                type={evidenceType.positive}
                setEmptyEvidence={setEmptyPositiveEvidence}
                setOpositeEvidenceLoading={setPositiveEvidenceLoading}
                opositeEvidenceLoading={negativeEvidenceLoading}
              />
              {/* passing loading positive evidence for displaying circular progess till both of them had been loaded */}
              <RelatedEvidencesContainer
                expandedAttribute={expandedAttribute}
                attributeId={id}
                type={evidenceType.negative}
                setEmptyEvidence={setEmptyNegativeEvidence}
                setOpositeEvidenceLoading={setNegativeEvidenceLoading}
                opositeEvidenceLoading={positiveEvidenceLoading}
              />
            </Box>
          )}

          <Typography
            variant="h6"
            mt={4}
            mb={2}
            sx={{ ml: { xs: 0.75, sm: 1.5, md: 2 } }}
          >
            <Trans i18nKey={"theAchivedScores"} />
          </Typography>
          <Box sx={{ pr: { xs: 2, sm: 6 } }}>
            {maturityScores
              .map((item: any) => {
                return (
                  <MaturityLevelDetailsContainer
                    maturity_score={item}
                    totalml={maturityLevel?.index}
                    mn={maturity_levels_count}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    attributeId={id}
                  />
                );
              })
              .reverse()}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

const AttributeStatusBarContainer = (props: any) => {
  const { status, ml, cl, mn } = props;
  const colorPallet = getMaturityLevelColors(mn);
  const statusColor = colorPallet[ml - 1];
  return (
    <Box
      display={"flex"}
      sx={{
        // ml: { xs: -1.5, sm: -3, md: -4 },
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Box display={"flex"} flex={1}>
        <Box width="100%">
          {ml && <AttributeStatusBar ml={ml} isMl={true} mn={mn} />}
          {(cl == 0 || cl) && <AttributeStatusBar cl={cl} mn={mn} />}
        </Box>
      </Box>
      <Box
        sx={{ ...styles.centerV, pl: 2, pr: { xs: 0, sm: 2 } }}
        minWidth={"245px"}
      >
        <Typography
          variant="h4"
          fontWeight={"bold"}
          letterSpacing=".15em"
          sx={{
            borderLeft: `2px solid ${statusColor}`,
            pl: 1,
            ml: { xs: -2, sm: 0 },
            pr: { xs: 0, sm: 1 },
            color: statusColor,
          }}
        >
          {status}
        </Typography>
      </Box>
    </Box>
  );
};

export const AttributeStatusBar = (props: any) => {
  const { ml, cl, isMl, isBasic, mn } = props;
  const width = isMl
    ? ml
      ? `${(ml / mn) * 100}%`
      : "0%"
    : cl
    ? `${cl}%`
    : "0%";
  return (
    <Box
      height={"38px"}
      width="100%"
      sx={{
        my: 0.5,
        background: "gray",
        borderTopRightRadius: "8px",
        borderBottomRightRadius: "8px",
        position: "relative",
        color: "white",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        height="100%"
        width={width}
        sx={{
          background: isMl ? "#6035A1" : "#3596A1",
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      ></Box>
      <Typography
        sx={{
          position: "absolute",
          zIndex: 1,
          left: "12px",
          opacity: 0.8,
          letterSpacing: { xs: ".09em", sm: ".15em" },
        }}
        textTransform="uppercase"
        variant="h6"
      >
        <Trans i18nKey={isMl ? "maturityLevel" : "confidenceLevel"} />
      </Typography>
      <Typography
        sx={{ position: "absolute", zIndex: 1, right: "12px" }}
        variant="h6"
      >
        {isMl ? `${ml} / ${mn}` : `${cl !== null ? cl : "--"}%`}
      </Typography>
    </Box>
  );
};

const MaturityLevelDetailsContainer = (props: any) => {
  const { maturity_score, totalml, mn, expanded, setExpanded, attributeId } =
    props;
  const { maturityLevel, score } = maturity_score;
  const colorPallet = getMaturityLevelColors(mn);
  const statusColor = colorPallet[maturityLevel?.index - 1];
  const is_passed = maturityLevel?.index <= totalml;
  const { service } = useServiceContext();
  const { assessmentId } = useParams();
  const fetchAffectedQuestionsOnAttributeQueryData = useQuery({
    service: (
      args = { assessmentId, attributeId: attributeId, levelId: expanded },
      config
    ) => service.fetchAffectedQuestionsOnAttribute(args, config),
    runOnMount: false,
  });

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  useEffect(() => {
    if (expanded === maturityLevel?.id) {
      fetchAffectedQuestionsOnAttributeQueryData.query();
    }
  }, [expanded]);

  let text;
  if (score == null) {
    text = <Trans i18nKey="noQuestionOnLevel" />;
  }
  if (is_passed && maturityLevel?.index == totalml) {
    text = <Trans i18nKey="theHighestLevelAchived" />;
  }

  const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip placement="bottom" {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 600,
      marginLeft: "36px",
      fontSize: "14px",
    },
  });
  return (
    <Box
      display={"flex"}
      sx={{
        maxWidth: { xs: "100%", sm: "100%", md: "91%", lg: "92%" },
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Accordion
        expanded={expanded === maturityLevel?.id}
        onChange={handleChange(maturityLevel?.id)}
        sx={{ width: "100%", boxShadow: "none !important" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{ padding: "0 !important" }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box display={"flex"} flex={1}>
              <Box width="100%">
                <MaturityLevelDetailsBar
                  text={text}
                  score={score}
                  highestIndex={is_passed && maturityLevel?.index == totalml}
                  is_passed={is_passed}
                />
              </Box>
            </Box>
            <Box sx={{ ...styles.centerV, pl: 2 }} minWidth={"245px"}>
              <Typography
                variant="h4"
                fontWeight={"bold"}
                letterSpacing=".15em"
                sx={{
                  borderLeft: `2px solid ${
                    is_passed ? statusColor : "#808080"
                  }`,
                  pl: 1,
                  ml: { xs: -2, sm: 0 },
                  pr: { xs: 0, sm: 1 },
                  color: is_passed ? statusColor : "#808080",
                }}
              >
                {maturityLevel?.title}
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <QueryData
            {...fetchAffectedQuestionsOnAttributeQueryData}
            render={(data) => {
              const {
                maxPossibleScore,
                gainedScore,
                gainedScorePercentage,
                questionsCount,
                questionnaires,
              } = data;
              return (
                <>
                  <Typography variant="body2" display={"flex"}>
                    <Trans i18nKey="maxPossibleScore" />
                    <Typography variant="body2" fontWeight={"bold"} ml={2}>
                      {maxPossibleScore}
                    </Typography>
                  </Typography>
                  <Typography mt={2} variant="body2" display={"flex"}>
                    <Trans i18nKey="gainedScore" />
                    <Typography
                      variant="body2"
                      display={"flex"}
                      fontWeight={"bold"}
                      ml={2}
                    >
                      {Math.ceil(gainedScore)}
                      <Typography variant="body2" fontWeight={"bold"} ml={0.5}>
                        ({Math.ceil(gainedScorePercentage * 100)} %)
                      </Typography>
                    </Typography>
                  </Typography>
                  <Typography mt={2} variant="body2" display={"flex"}>
                    <Trans i18nKey="questionsCount" />
                    <Typography variant="body2" fontWeight={"bold"} ml={2}>
                      {questionsCount}
                    </Typography>
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  {questionnaires.map((questionnaire: any) => {
                    const { title, questionScores } = questionnaire;

                    return (
                      <>
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={"bold"}
                            sx={{ opacity: "0.8", ml: 1 }}
                          >
                            {title}
                          </Typography>
                        </Box>

                        <Box mt={2}>
                          <Box
                            sx={{
                              display: "flex",
                              width: { xs: "100%", sm: "100%", md: "80%" },
                              flexDirection: "column",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                ml: { xs: 0, sm: 4 },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <Box sx={{ width: "40%" }}>
                                  <Typography
                                    sx={{
                                      pb: "4px",
                                      color: "#767676",
                                      display: "block",
                                      fontFamily: "Roboto",
                                      fontSize: "0.8rem",
                                    }}
                                    textAlign={"center"}
                                  >
                                    <Trans i18nKey="questions" />
                                  </Typography>
                                </Box>
                                <Box sx={{ width: "10%" }}>
                                  <Typography
                                    sx={{
                                      pb: "4px",
                                      color: "#767676",
                                      display: "block",
                                      fontFamily: "Roboto",
                                      fontSize: "0.8rem",
                                    }}
                                    textAlign={"center"}
                                  >
                                    <Trans i18nKey="weight" />
                                  </Typography>
                                </Box>
                                <Box sx={{ width: "25%" }}>
                                  <Typography
                                    sx={{
                                      pb: "4px",
                                      color: "#767676",
                                      display: "block",
                                      fontFamily: "Roboto",
                                      fontSize: "0.8rem",
                                    }}
                                    textAlign={"center"}
                                  >
                                    <Trans i18nKey="answer" />
                                  </Typography>
                                </Box>
                                <Box sx={{ width: "10%" }}>
                                  <Typography
                                    sx={{
                                      pb: "4px",
                                      color: "#767676",
                                      display: "block",
                                      fontFamily: "Roboto",
                                      fontSize: "0.8rem",
                                    }}
                                    textAlign={"center"}
                                  >
                                    <Trans i18nKey="score" />
                                  </Typography>
                                </Box>
                                <Box sx={{ width: "15%" }}>
                                  <Typography
                                    sx={{
                                      pb: "4px",
                                      color: "#767676",
                                      display: "block",
                                      fontFamily: "Roboto",
                                      fontSize: "0.8rem",
                                    }}
                                    textAlign={"center"}
                                  >
                                    <Trans i18nKey="weightedScore" />
                                  </Typography>
                                </Box>
                              </Box>
                              <Divider sx={{ my: 1 }} />
                              {questionScores.map((question: any) => {
                                const {
                                  questionIndex,
                                  questionTitle,
                                  questionWeight,
                                  answerOptionIndex,
                                  answerOptionTitle,
                                  answerIsNotApplicable,
                                  answerScore,
                                  weightedScore,
                                } = question;
                                return (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      my: 1,
                                    }}
                                  >
                                    <CustomWidthTooltip
                                      title={`${questionIndex}.${questionTitle}`}
                                    >
                                      <Box sx={{ width: "40%" }}>
                                        <Typography
                                          display="flex"
                                          variant="body1"
                                          fontFamily="Roboto"
                                          fontWeight={"bold"}
                                          textAlign={"left"}
                                        >
                                          {questionIndex}.
                                          <Typography
                                            variant="body1"
                                            fontFamily="Roboto"
                                            fontWeight={"bold"}
                                            sx={{
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              direction: "rtl",
                                            }}
                                          >
                                            {questionTitle}
                                          </Typography>
                                        </Typography>
                                      </Box>
                                    </CustomWidthTooltip>
                                    <Box sx={{ width: "10%" }}>
                                      <Typography
                                        variant="body1"
                                        fontFamily="Roboto"
                                        fontWeight={"bold"}
                                        textAlign={"center"}
                                      >
                                        {questionWeight}
                                      </Typography>
                                    </Box>
                                    <Tooltip
                                      title={
                                        answerIsNotApplicable
                                          ? "NA"
                                          : answerOptionTitle !== null
                                          ? `${answerOptionIndex}.${answerOptionTitle}`
                                          : "---"
                                      }
                                    >
                                      <Box sx={{ width: "25%" }}>
                                        <Typography
                                          variant="body1"
                                          fontFamily="Roboto"
                                          fontWeight={"bold"}
                                          textAlign={"center"}
                                        >
                                          {answerIsNotApplicable
                                            ? "NA"
                                            : answerOptionTitle !== null
                                            ? `${answerOptionIndex}.${answerOptionTitle}`
                                            : "---"}
                                        </Typography>
                                      </Box>
                                    </Tooltip>
                                    <Box sx={{ width: "10%" }}>
                                      <Typography
                                        variant="body1"
                                        fontFamily="Roboto"
                                        fontWeight={"bold"}
                                        textAlign={"center"}
                                      >
                                        {answerIsNotApplicable
                                          ? "---"
                                          : answerScore}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ width: "15%" }}>
                                      <Typography
                                        variant="body1"
                                        fontFamily="Roboto"
                                        fontWeight={"bold"}
                                        textAlign={"center"}
                                      >
                                        {answerIsNotApplicable
                                          ? "---"
                                          : weightedScore}
                                      </Typography>
                                    </Box>
                                  </Box>
                                );
                              })}
                            </Box>
                          </Box>
                          <Divider
                            sx={{
                              my: 4,
                              background: "#7A589B",
                              opacity: "40%",
                            }}
                          />
                        </Box>
                      </>
                    );
                  })}
                </>
              );
            }}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
export const MaturityLevelDetailsBar = (props: any) => {
  const { score, is_passed, text, highestIndex } = props;
  const width = `${score != null ? score : 100}%`;
  const bg_color = is_passed ? "#1769aa" : "#545252";
  const color = is_passed ? "#d1e6f8" : "#808080";
  return (
    <Box
      height={"38px"}
      width="100%"
      sx={{
        my: 0.5,
        background: color,
        borderTopRightRadius: "8px",
        borderBottomRightRadius: "8px",
        position: "relative",
        color: "white",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        height="100%"
        width={width}
        sx={{
          background: `${score != null ? bg_color : ""}`,
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      ></Box>
      <Typography
        sx={{
          position: "absolute",
          zIndex: 1,
          left: "12px",
          opacity: 0.8,
          letterSpacing: { xs: ".09em", sm: ".15em" },
          fontSize: { xs: "12px", sm: "16px" },
          color: theme.palette.getContrastText(color),
        }}
        textTransform="uppercase"
        variant="h6"
      >
        {text}
      </Typography>
      <Typography
        sx={{
          position: "absolute",
          zIndex: 1,
          right: "12px",
          color: theme.palette.getContrastText(color),
        }}
        variant="h6"
      >
        {score != null && Math.ceil(score)}
        {score != null ? "%" : ""}
      </Typography>
    </Box>
  );
};

interface RelatedEvidencesContainerProps {
  attributeId: string;
  type: evidenceType;
  expandedAttribute: string | false;
  setEmptyEvidence: (value: boolean) => void;
  setOpositeEvidenceLoading: (value: boolean) => void;
  opositeEvidenceLoading: boolean;
}

const RelatedEvidencesContainer: React.FC<RelatedEvidencesContainerProps> = ({
  attributeId,
  type,
  expandedAttribute,
  setEmptyEvidence,
  opositeEvidenceLoading,
  setOpositeEvidenceLoading,
}) => {
  const { assessmentId } = useParams();
  const { service } = useServiceContext();
  const fetchRelatedEvidences = useQuery({
    service: (args = { assessmentId, attributeId, type }, config) =>
      service.fetchRelatedEvidences(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    if (expandedAttribute === attributeId) {
      fetchRelatedEvidences.query();
    }
  }, [expandedAttribute]);

  useEffect(() => {
    if (fetchRelatedEvidences.loaded) {
      setOpositeEvidenceLoading(true);
      if (fetchRelatedEvidences?.data?.items.length === 0) {
        setEmptyEvidence(true);
      }
    }
  }, [fetchRelatedEvidences.loaded]);

  const renderEmptyState = () => (
    <Box width="100%" padding={4} gap={3} sx={{ ...styles.centerCVH }}>
      <img
        width="75%"
        src={
          type === evidenceType.positive
            ? emptyPositiveState
            : emptyNegativeState
        }
        alt="empty"
      />
      <Typography variant="h5" color="#9DA7B3">
        <Trans
          i18nKey={
            type === evidenceType.positive
              ? "noPositiveEvidence"
              : "noNegativeEvidence"
          }
        />
      </Typography>
    </Box>
  );

  const renderEvidenceItems = () => (
    <Box
      sx={{ ...styles.centerCH }}
      gap="16px"
      borderRadius="16px"
      height={"442px"}
      width="100%"
      padding="16px 0px 0px 0px"
      border="1px solid"
      borderColor={type === evidenceType.positive ? "#A4E7E7" : "#EFA5BD"}
    >
      <Typography
        variant="h5"
        color={type === evidenceType.positive ? "#1CC2C4" : "#D81E5B"}
      >
        <Trans
          i18nKey={
            type === evidenceType.positive
              ? "positiveEvidences"
              : "negativeEvidences"
          }
        />
      </Typography>
      <Divider
        sx={{
          width: "100%",
          backgroundColor:
            type === evidenceType.positive ? "#A4E7E7" : "#EFA5BD",
        }}
      />
      <Box
        overflow="auto"
        gap="8px"
        display="flex"
        flexDirection="column"
        paddingX="30px"
        width="100%"
      >
        {fetchRelatedEvidences?.data?.items?.map((item: any, index: number) => (
          <EvidanceDescription
            key={index}
            number={index + 1}
            item={item}
            color={type === evidenceType.positive ? "#A4E7E7" : "#EFA5BD"}
            textColor={type === evidenceType.positive ? "#1CC2C4" : "#D81E5B"}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      {fetchRelatedEvidences.loading || !opositeEvidenceLoading ? (
        <Box
          sx={{ ...styles.centerVH }}
          height="200px"
          width="100%"
        >
          <CircularProgress />
        </Box>
      ) : fetchRelatedEvidences?.data?.items.length === 0 ? (
        renderEmptyState()
      ) : (
        renderEvidenceItems()
      )}
    </>
  );
};

const EvidanceDescription = ({
  number,
  color,
  textColor,
  item,
}: {
  number: number;
  color: string;
  textColor: string;
  item: any;
}) => {
  return (
    <>
      <Box display="flex" justifyContent="flex-start" alignItems="center">
        <Typography display="flex" margin="16px" color={textColor}>
          {number}
        </Typography>
        <Typography>{item?.description}</Typography>
      </Box>
      <Divider sx={{ width: "100%", backgroundColor: color }} />
    </>
  );
};

export default SUbjectAttributeCard;
