package com.rfq.dto;

import java.time.LocalDateTime;

public class RFQRequest {
    public String rfqName;
    public String referenceId;
    public LocalDateTime bidStartTime, bidCloseTime, forcedCloseTime;
    public Integer triggerWindowMinutes, extensionMinutes;
    public String triggerType;
}