import Typography, { TypographyProps } from "@mui/material/Typography";
import { Avatar, Box, BoxProps } from "@mui/material";
import { Link as RLink, To } from "react-router-dom";
import Link from "@mui/material/Link";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { IconProps, SvgIconProps } from "@mui/material";
import AnchorRoundedIcon from "@mui/icons-material/AnchorRounded";
import { styles } from "@styles";
interface ITitle extends Omit<TypographyProps, "borderBottom"> {
  sup?: JSX.Element | string;
  sub?: JSX.Element | string;
  borderBottom?: string | boolean;
  toolbar?: JSX.Element;
  backLink?: To | -1;
  backIconProps?: SvgIconProps;
  size?: "small" | "medium" | "large";
  wrapperProps?: BoxProps;
  toolbarProps?: BoxProps;
  inPageLink?: string;
  avatar?: JSX.Element;
  titleProps?: TypographyProps;
  subProps?: TypographyProps;
}

const Title = (props: ITitle) => {
  const {
    sup,
    children,
    sub,
    borderBottom,
    toolbar,
    size = "medium",
    backLink,
    backIconProps = {},
    wrapperProps = {},
    toolbarProps = {},
    titleProps = {},
    subProps = {},
    inPageLink,
    avatar,
    ...rest
  } = props;

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-end"
      sx={{
        paddingBottom: "2px",
        "&:hover a.title-hash-link": { opacity: 1 },
        borderBottom:
          typeof borderBottom === "boolean" && borderBottom
            ? (theme) => `1px solid ${theme.palette.grey[300]}`
            : (borderBottom as string),
        ...(rest.sx || {}),
        ...wrapperProps,
      }}
      {...wrapperProps}
    >
      {avatar && (
        <Box sx={{ ...styles.centerV, alignSelf: "center" }}>{avatar}</Box>
      )}
      <Box sx={{ flex: 1 }} {...rest}>
        {backLink ? (
          <Box display="flex" justifyContent={"flex-start"}>
            <Box
              minWidth="40px"
              sx={{
                ...styles.centerV,
                textDecoration: "none",
                ml: sup ? { xs: 0, md: "-22px" } : "-4px",
              }}
            >
              <Box component={RLink} to={backLink as To} display="flex">
                <ArrowBackRoundedIcon
                  fontSize="small"
                  color="inherit"
                  sx={{ opacity: 0.85, color: "gray", mr: 0.5 }}
                  {...backIconProps}
                />
              </Box>
              {sup && (
                <Typography
                  textTransform="uppercase"
                  variant={
                    size === "small"
                      ? "subSmall"
                      : size === "large"
                      ? "subLarge"
                      : "subMedium"
                  }
                  lineHeight={0}
                >
                  {sup}
                </Typography>
              )}
            </Box>
          </Box>
        ) : sup ? (
          <Typography
            textTransform="uppercase"
            variant={
              size === "small"
                ? "subSmall"
                : size === "large"
                ? "subLarge"
                : "subMedium"
            }
            {...subProps}
          >
            {sup}
          </Typography>
        ) : (
          <></>
        )}
        <Typography
          variant={size === "small" ? "h6" : size === "large" ? "h4" : "h5"}
          textTransform="uppercase"
          fontWeight="bold"
          {...titleProps}
          sx={{
            ...styles.centerV,
            display: { xs: "block", sm: "flex" },
            ...((titleProps?.sx || {}) as any),
          }}
        >
          {children}
          {inPageLink && (
            <Link
              href={`#${inPageLink}`}
              className="title-hash-link"
              sx={{
                display: "flex",
                opacity: 0,
                alignItems: "center",
                ml: 1,
                transition: "opacity .1s ease",
                position: "relative",
              }}
            >
              <AnchorRoundedIcon fontSize="small" />
              <Box id={inPageLink} position="absolute" top="-84px" />
            </Link>
          )}
        </Typography>
        {sub && (
          <Typography
            variant={
              size === "small"
                ? "subSmall"
                : size === "large"
                ? "subLarge"
                : "subMedium"
            }
          >
            {sub}
          </Typography>
        )}
      </Box>
      <Box ml="auto" {...toolbarProps}>
        {toolbar}
      </Box>
    </Box>
  );
};

export default Title;
