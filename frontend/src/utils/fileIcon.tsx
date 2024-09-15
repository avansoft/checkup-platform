export const FileIcon = (props: any) => {
  const {
    hover,
    downloadFile,
    item,
    setEvidenceId,
    evidenceId,
    setExpandedDeleteAttachmentDialog,
    mainColor,
    name,
    exp,
    displayName,
    border,
    width,
    height,
  } = props;
  return (
    <div style={{ position: "relative" }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {border && (
          <rect
            x="0.25"
            y="0.25"
            width="59.5"
            height="59.5"
            rx="7.75"
            stroke={mainColor}
            strokeWidth="0.5"
          />
        )}
        <g opacity="0.5">
          <path
            opacity="0.5"
            d="M35.9523 10.3872C35.132 10.3864 34.3455 10.0603 33.7654 9.48042C33.1854 8.90056 32.8591 8.11434 32.8583 7.2943V3H19.0329C17.962 3 16.935 3.42527 16.1778 4.18223C15.4205 4.93919 14.9951 5.96582 14.9951 7.03632V31.3683C14.9967 32.4378 15.4228 33.4629 16.1799 34.2185C16.9369 34.9742 17.9631 35.3986 19.0329 35.3986H35.6297C36.6996 35.3986 37.7257 34.9742 38.4828 34.2185C39.2398 33.4629 39.6659 32.4378 39.6675 31.3683V10.3872H35.9523Z"
            fill={mainColor}
          />
        </g>
        <path
          d="M39.6676 10.3872H35.9524C35.1321 10.3864 34.3455 10.0603 33.7655 9.48042C33.1854 8.90056 32.8592 8.11434 32.8584 7.2943V3L39.6676 10.3872Z"
          fill={mainColor}
        />
        <path
          d="M34.5927 25.6252H19.1017C18.9525 25.6252 18.8094 25.5659 18.7039 25.4604C18.5983 25.3549 18.5391 25.2119 18.5391 25.0627C18.5395 24.9138 18.5989 24.7711 18.7044 24.6659C18.8099 24.5608 18.9528 24.5017 19.1017 24.5017H34.5927C34.7415 24.5017 34.8843 24.5608 34.9895 24.666C35.0948 24.7712 35.1539 24.9139 35.1539 25.0627C35.1541 25.1365 35.1397 25.2096 35.1116 25.2778C35.0835 25.3461 35.0422 25.408 34.9901 25.4603C34.9379 25.5125 34.876 25.554 34.8078 25.5823C34.7396 25.6106 34.6665 25.6252 34.5927 25.6252Z"
          fill={mainColor}
        />
        <path
          d="M34.5927 19.2892H19.1017C18.9528 19.2892 18.8099 19.2301 18.7044 19.125C18.5989 19.0198 18.5395 18.8772 18.5391 18.7282C18.5391 18.5791 18.5983 18.436 18.7039 18.3305C18.8094 18.225 18.9525 18.1658 19.1017 18.1658H34.5927C34.6665 18.1658 34.7396 18.1803 34.8078 18.2086C34.876 18.2369 34.9379 18.2783 34.9901 18.3306C35.0422 18.3828 35.0835 18.4449 35.1116 18.5131C35.1397 18.5813 35.1541 18.6545 35.1539 18.7282C35.1539 18.877 35.0948 19.0197 34.9895 19.1249C34.8843 19.2301 34.7415 19.2892 34.5927 19.2892Z"
          fill={mainColor}
        />
        <path
          d="M34.5927 22.4572H19.1017C18.9525 22.4572 18.8094 22.3979 18.7039 22.2924C18.5983 22.187 18.5391 22.0439 18.5391 21.8947C18.5395 21.7458 18.5989 21.6031 18.7044 21.4979C18.8099 21.3928 18.9528 21.3337 19.1017 21.3337H34.5927C34.7415 21.3337 34.8843 21.3928 34.9895 21.4981C35.0948 21.6033 35.1539 21.7459 35.1539 21.8947C35.1541 21.9685 35.1397 22.0416 35.1116 22.1099C35.0835 22.1781 35.0422 22.2401 34.9901 22.2924C34.9379 22.3446 34.876 22.3861 34.8078 22.4143C34.7396 22.4426 34.6665 22.4572 34.5927 22.4572Z"
          fill={mainColor}
        />
        <path
          d="M28.4828 16.1215H19.1017C18.9528 16.1215 18.8099 16.0625 18.7044 15.9573C18.5989 15.8521 18.5395 15.7094 18.5391 15.5605C18.5391 15.4113 18.5983 15.2683 18.7039 15.1628C18.8094 15.0573 18.9525 14.998 19.1017 14.998H28.4828C28.6317 14.9984 28.7745 15.0579 28.8797 15.1633C28.9849 15.2688 29.0439 15.4116 29.0439 15.5605C29.0435 15.7092 28.9843 15.8516 28.8791 15.9567C28.774 16.0619 28.6315 16.1211 28.4828 16.1215V16.1215Z"
          fill={mainColor}
        />
        <path
          d="M28.4828 12.9535H19.1017C18.9528 12.9535 18.8099 12.8945 18.7044 12.7893C18.5989 12.6841 18.5395 12.5415 18.5391 12.3926C18.5391 12.2434 18.5983 12.1003 18.7039 11.9948C18.8094 11.8893 18.9525 11.8301 19.1017 11.8301H28.4828C28.6317 11.8305 28.7745 11.8899 28.8797 11.9953C28.9849 12.1008 29.0439 12.2436 29.0439 12.3926C29.0435 12.5412 28.9843 12.6837 28.8791 12.7888C28.774 12.8939 28.6315 12.9531 28.4828 12.9535Z"
          fill={mainColor}
        />
        <path
          d="M42.5946 28.5903H23.8326C22.5017 28.5903 21.4229 29.6688 21.4229 30.9992V36.591C21.4229 37.9214 22.5017 38.9999 23.8326 38.9999H42.5946C43.9255 38.9999 45.0044 37.9214 45.0044 36.591V30.9992C45.0044 29.6688 43.9255 28.5903 42.5946 28.5903Z"
          fill={mainColor}
        />
        <path
          d="M34.3173 11.8301H31.6644C31.202 11.8301 30.8271 12.2048 30.8271 12.667V15.3189C30.8271 15.7812 31.202 16.1559 31.6644 16.1559H34.3173C34.7797 16.1559 35.1545 15.7812 35.1545 15.3189V12.667C35.1545 12.2048 34.7797 11.8301 34.3173 11.8301Z"
          fill={mainColor}
        />
      </svg>
      {hover && (
        <div
          onClick={() => downloadFile(item)}
          style={{ position: "absolute", top: "7px", left: "7px", zIndex: 1 }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 15.575C11.8667 15.575 11.7417 15.5542 11.625 15.5125C11.5083 15.4708 11.4 15.4 11.3 15.3L7.7 11.7C7.5 11.5 7.40417 11.2667 7.4125 11C7.42083 10.7333 7.51667 10.5 7.7 10.3C7.9 10.1 8.1375 9.99583 8.4125 9.9875C8.6875 9.97917 8.925 10.075 9.125 10.275L11 12.15V5C11 4.71667 11.0958 4.47917 11.2875 4.2875C11.4792 4.09583 11.7167 4 12 4C12.2833 4 12.5208 4.09583 12.7125 4.2875C12.9042 4.47917 13 4.71667 13 5V12.15L14.875 10.275C15.075 10.075 15.3125 9.97917 15.5875 9.9875C15.8625 9.99583 16.1 10.1 16.3 10.3C16.4833 10.5 16.5792 10.7333 16.5875 11C16.5958 11.2667 16.5 11.5 16.3 11.7L12.7 15.3C12.6 15.4 12.4917 15.4708 12.375 15.5125C12.2583 15.5542 12.1333 15.575 12 15.575ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V16C4 15.7167 4.09583 15.4792 4.2875 15.2875C4.47917 15.0958 4.71667 15 5 15C5.28333 15 5.52083 15.0958 5.7125 15.2875C5.90417 15.4792 6 15.7167 6 16V18H18V16C18 15.7167 18.0958 15.4792 18.2875 15.2875C18.4792 15.0958 18.7167 15 19 15C19.2833 15 19.5208 15.0958 19.7125 15.2875C19.9042 15.4792 20 15.7167 20 16V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z"
              fill="white"
            />
          </svg>
        </div>
      )}
      {hover && (
        <div
          onClick={() => {
            setEvidenceId(evidenceId);
            setExpandedDeleteAttachmentDialog({ expended: true, id: item.id });
          }}
          style={{
            position: "absolute",
            width: "20px",
            height: "20px",
            top: "-8px",
            right: "-8px",
            zIndex: 1,
            borderRadius: "100%",
            background: mainColor,
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "100%",
              background: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.5 3.205L8.795 2.5L6 5.295L3.205 2.5L2.5 3.205L5.295 6L2.5 8.795L3.205 9.5L6 6.705L8.795 9.5L9.5 8.795L6.705 6L9.5 3.205Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      )}
      {displayName && (
        <p
          style={{
            position: "absolute",
            color: mainColor,
            top: "15px",
            left: "3px",
            fontSize: "9px",
          }}
        >
          {name?.substring(0, 6)}...
        </p>
      )}
      {/*<p style={{position: 'absolute', color: "#fff", bottom: "14px", right: "13px", fontSize: '6px'}}*/}
      {/*>{exp}</p>*/}
      <p
        style={{
          position: "absolute",
          color: "#fff",
          bottom: "21px",
          right: "23px",
          fontSize: "9px",
        }}
      >
        {exp}
      </p>
    </div>
  );
};
