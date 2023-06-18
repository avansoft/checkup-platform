import React from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Title from "@common/Title";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { SpaceMembers } from "./SpaceMembers";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { useAuthContext } from "@providers/AuthProvider";
import ErrorAccessDenied from "@common/errors/ErrorAccessDenied";
import { styles } from "@styles";
import { ISpaceModel } from "@types";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import useDialog from "@utils/useDialog";
import CreateSpaceDialog from "./CreateSpaceDialog";
import { LoadingButton } from "@mui/lab";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";

const SpaceSettingContainer = () => {
  const { spaceId = "" } = useParams();
  const { service } = useServiceContext();
  const { userInfo } = useAuthContext();
  const userId = userInfo?.id;
  const { loading, data, query } = useQuery<ISpaceModel>({
    service: (args, config) => service.fetchSpace({ spaceId }, config),
  });

  const { title } = data || {};
  const isOwner = userId == data?.owner?.id;
  return (
    <Box maxWidth="1440px" m="auto">
      <Title
        sup={
          <SupTitleBreadcrumb
            routes={[
              {
                to: "/spaces",
                title: "spaces",
                sup: "spaces",
                icon: <FolderRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />,
              },
            ]}
          />
        }
        toolbar={isOwner ? <EditSpaceButton fetchSpace={query} /> : <div />}
        backLink={-1}
      >
        <Box sx={{ ...styles.centerV, opacity: 0.9 }}>
          {loading ? (
            <Skeleton variant="rounded" width="110px" sx={{ mr: 1 }} />
          ) : (
            title
          )}{" "}
          <Trans i18nKey="setting" />
        </Box>
      </Title>
      <Box pt={3}>
        {!loading && <SpaceSettings isOwner={isOwner} owner={data?.owner} />}
      </Box>
    </Box>
  );
};

const EditSpaceButton = (props: any) => {
  const { fetchSpace } = props;
  const { service } = useServiceContext();
  const { spaceId } = useParams();
  const queryData = useQuery({
    service: (args = { spaceId }, config) => service.fetchSpace(args, config),
    runOnMount: false,
  });
  const dialogProps = useDialog();

  const openEditDialog = async (e: any) => {
    const data = await queryData.query();
    dialogProps.openDialog({
      data,
      type: "update",
    });
  };

  return (
    <>
      <LoadingButton
        loading={queryData.loading}
        startIcon={<BorderColorRoundedIcon />}
        size="small"
        onClick={openEditDialog}
      >
        <Trans i18nKey="editSpace" />
      </LoadingButton>
      <CreateSpaceDialog {...dialogProps} onSubmitForm={fetchSpace} />
    </>
  );
};

function SpaceSettings(props: { isOwner: boolean; owner: any }) {
  const { owner } = props;
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box>
          <TabList onChange={handleChange}>
            <Tab
              label={
                <Box sx={{ ...styles.centerV }}>
                  <GroupsRoundedIcon fontSize="small" sx={{ mr: "8px" }} />
                  <Trans i18nKey="members" />
                </Box>
              }
              value="1"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          {/* <ErrorAccessDenied hasAccess={isOwner}> */}
          <SpaceMembers owner={owner} />
          {/* </ErrorAccessDenied> */}
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default SpaceSettingContainer;
