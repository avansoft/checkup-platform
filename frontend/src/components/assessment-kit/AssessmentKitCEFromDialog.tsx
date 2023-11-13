import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "@common/fields/InputField";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import setServerFieldErrors from "@utils/setServerFieldError";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import { ICustomError } from "@utils/CustomError";
import { Link, useNavigate, useParams } from "react-router-dom";
import toastError from "@utils/toastError";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import AutocompleteAsyncField, {
  useConnectAutocompleteField,
} from "@common/fields/AutocompleteAsyncField";
import UploadField from "@common/fields/UploadField";
import RichEditorField from "@common/fields/RichEditorField";
import { Box, Button, Typography, Alert } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Divider from "@mui/material/Divider";

interface IAssessmentKitCEFromDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm: () => void;
  openDialog?: any;
  context?: any;
}

const AssessmentKitCEFromDialog = (props: IAssessmentKitCEFromDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [showErrorLog, setShowErrorLog] = useState<boolean>(false);
  const [syntaxErrorObject, setSyntaxErrorObjectg] = useState<any>();
  const { service } = useServiceContext();
  const {
    onClose: closeDialog,
    onSubmitForm,
    context = {},
    openDialog,
    ...rest
  } = props;
  const { type, data = {} } = context;
  const { expertGroupId: fallbackExpertGroupId } = useParams();
  const { id, expertGroupId = fallbackExpertGroupId } = data;
  const defaultValues = type === "update" ? data : {};
  const formMethods = useForm({ shouldUnregister: true });
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const navigate = useNavigate();
  const close = () => {
    abortController.abort();
    setShowErrorLog(false);
    closeDialog();
  };

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    event.preventDefault();
    const { dsl_id, tags = [], ...restOfData } = data;
    const formattedData = {
      dsl_id: dsl_id.id,
      tag_ids: tags.map((t: any) => t.id),
      expert_group_id: expertGroupId,
      ...restOfData,
    };
    setLoading(true);
    try {
      const { data: res } =
        type === "update"
          ? await service.updateAssessmentKit(
              { data: formattedData, assessmentKitId: id },
              { signal: abortController.signal }
            )
          : await service.createAssessmentKit(
              { data: formattedData },
              { signal: abortController.signal }
            );
      setLoading(false);
      onSubmitForm();
      close();
      shouldView && res?.id && navigate(`assessment-kits/${res.id}`);
    } catch (e: any) {
      const err = e as ICustomError;
      if (e?.status == 422) {
        setSyntaxErrorObjectg(e.data?.errors);
        setShowErrorLog(true);
      }

      if (e?.status !== 422) {
        toastError(err);
      }
      setLoading(false);
      setServerFieldErrors(err, formMethods);
      formMethods.clearErrors();

      return () => {
        abortController.abort();
      };
    }
  };
  const formContent = (
    <FormProviderWithForm formMethods={formMethods}>
      <Grid container spacing={2} sx={styles.formGrid}>
        <Grid item xs={12} md={5}>
          <InputFieldUC
            name="title"
            label={<Trans i18nKey="title" />}
            required
            defaultValue={defaultValues.title || ""}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <UploadField
            accept={{ "application/zip": [".zip"] }}
            uploadService={(args, config) =>
              service.uploadAssessmentKitDSL(args, config)
            }
            deleteService={(args, config) =>
              service.deleteAssessmentKitDSL(args, config)
            }
            name="dsl_id"
            required={true}
            label={<Trans i18nKey="dsl" />}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <AutocompleteAsyncField
            {...useConnectAutocompleteField({
              service: (args, config) =>
                service.fetchAssessmentKitTags(args, config),
            })}
            name="tags"
            multiple={true}
            searchOnType={false}
            required={true}
            label={<Trans i18nKey="tags" />}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <InputFieldUC
            name="summary"
            label={<Trans i18nKey="summary" />}
            required={true}
            defaultValue={defaultValues.summary || ""}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <RichEditorField
            name="about"
            label={<Trans i18nKey="about" />}
            required={true}
            defaultValue={defaultValues.about || ""}
          />
        </Grid>
      </Grid>
      <CEDialogActions
        closeDialog={close}
        loading={loading}
        type={type}
        hasViewBtn={true}
        onSubmit={(...args) =>
          formMethods.handleSubmit((data) => onSubmit(data, ...args))
        }
      />
    </FormProviderWithForm>
  );

  const syntaxErrorContent = (
    <Box>
      <Typography ml={1} variant="h6">
        <Trans i18nKey="youveGotSyntaxErrorsInYourDslFile" />
      </Typography>
      <Divider />
      <Box mt={4} sx={{ maxHeight: "260px", overflow: "scroll" }}>
        {syntaxErrorObject &&
          syntaxErrorObject.map((e: any, index: number) => {
            return (
              <Box sx={{ ml: 1 }}>
                <Alert severity="error" sx={{ my: 2 }}>
                  <Box sx={{ display: "flex" }}>
                    <Typography variant="subtitle2" color="error">
                      <Trans
                        i18nKey="errorAtLine"
                        values={{
                          message: e.message,
                          fileName: e.fileName,
                          line: e.line,
                          column: e.column,
                        }}
                      />
                    </Typography>
                  </Box>
                </Alert>
              </Box>
            );
          })}
      </Box>
      <Grid mt={4} container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button onClick={close} data-cy="cancel">
            <Trans i18nKey="cancel" />
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => setShowErrorLog(false)}>
            <Trans i18nKey="Back" />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <>
          <NoteAddRoundedIcon sx={{ mr: 1 }} />
          {type === "update" ? (
            <Trans i18nKey="updateAssessmentKit" />
          ) : (
            <Trans i18nKey="createAssessmentKit" />
          )}
        </>
      }
    >
      {!showErrorLog ? formContent : syntaxErrorContent}
    </CEDialog>
  );
};

export default AssessmentKitCEFromDialog;
