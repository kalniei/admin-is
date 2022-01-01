import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useEffect, useState } from 'react';
import { request } from '../helpers/restClient';
import { IEmailObject } from '../ts/interfaces';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import parse from 'html-react-parser';

const EmailManager = (): JSX.Element => {
  const [emailTemplates, setEmailTemplates] = useState<IEmailObject[]>([]);
  const [expanded, setExpanded] = useState<number | false>(false);

  const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getAllTemplates = async () => {
    const { data } = await request('get', '/getEmailTemplates');
    console.log(data);

    setEmailTemplates(data);
  };

  const htmlDecode = (str: string): string => {
    var txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  };

  useEffect(() => {
    getAllTemplates();
  }, []);

  return (
    <Grid container justifyContent="center" p={4}>
      <Grid item xs={12}>
        {emailTemplates.map((template) => (
          <Accordion
            key={template.unique_id}
            expanded={expanded === template.unique_id}
            onChange={handleChange(template.unique_id)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{template.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* <Typography>{template.content}</Typography> */}
              {parse(template.content, { trim: true })}
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>
    </Grid>
  );
};

export default EmailManager;
