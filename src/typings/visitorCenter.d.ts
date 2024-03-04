declare namespace VisitorCenter {
  interface getVisitorPageListVo {
    approvalMsg?: string;
    visitorName: string;
    limitStartTime: string;
    limitEndTime: string;
    visitorLogStatus: number;
    visitorReason: string;
    uuid: string;
    telephone: string;
    ownerRoomAddress: string;
    visitorPhoneNo: string;
    noticeList: Array<any>;
    ownerProjectCode: string;
  }
}
