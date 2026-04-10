export class FacebookFieldData {
  name: string;
  values: string[];
}

export class FacebookLeadDto {
  leadgen_id: string;
  page_id: string;
  form_id: string;
  field_data: FacebookFieldData[];
}

export class GoogleColumnData {
  column_id: string;
  string_value: string;
}

export class GoogleLeadDto {
  lead_id: string;
  campaign_id: string;
  api_version: string;
  column_data: GoogleColumnData[];
}
