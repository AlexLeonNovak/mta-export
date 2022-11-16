export const toMautic = (mtaFields: Record<string, any>): Record<string, any> => {
    const fields = {
        firstname: mtaFields['FirstName'],
        lastname: mtaFields['Surname'],
        mobile: mtaFields['Phone_Number_3'],
        email: mtaFields['Home_email'],
        studytype: mtaFields['Description_of_Group'],
        mailingconfirmation: mtaFields['ApproveMail'],
        newleaddate: mtaFields['CreationDate'],
        signupdate: mtaFields['RegistrationDate'],
        Consultantname: mtaFields['Name_of_Consultant'],
        Consultdate: mtaFields['Planned_Date'],
        Consulthour: mtaFields['Scheduled_Hour'],
    };
    switch (mtaFields['Event_desctiption']) {
        case 1:
        case '1':
            fields['leadsource'] = 'קליטת ליד מהאינטרנט';
            break;
        case 2:
        case '2':
            fields['leadsource'] = 'קליטת ליד טלפונית';
    }

    switch (mtaFields['Result_Description']) {
        case 106:
        case '106':
            fields['didntanswer'] = 'לא ענה שיחת בירור';
            break;
        case 104:
        case '104':
            fields['didntanswer'] = 'לא ענה פעמיים-אין תא קולי';
            break;
        case 117:
        case '117':
            fields['didntanswer'] = 'אין מענה 3 פעמים';
            break;
        case 'אין':
            fields['didntanswer'] = 'לא ענה פעם 1';
            break;
        case 58:
        case '58':
            fields['didntanswer'] = 'לא ענה 5 פעמים-SMS';
            break;
        case 123:
        case '123':
            fields['psychometricstatus'] = ' מתלבט צריך לשפר פסיכומטרי';
            break;
        case 124:
        case '124':
            fields['psychometricstatus'] = 'מתלבט צריך להשלים פסיכומטרי';
            break;
        case 10:
        case '10':
            fields['psychometricstatus'] = 'פסיכומטרי דצמבר מתכוון לעשות';
            fields['Psychometricmonth'] = 'דצמבר';
            fields['Psychometricdate'] = new Date('12/23/2022 11:38:00');
            fields['psychometricresult'] = new Date('2/2/2023 11:00:00');
            break;
        case 11:
        case '11':
            fields['psychometricstatus'] = 'פסיכומטרי מרץ מתכוון לעשות';
            fields['Psychometricmonth'] = 'מרץ';
            fields['Psychometricdate'] = new Date('4/2/2023 11:00:00');
            fields['psychometricresult'] = new Date('5/16/2022 11:00:00');
            break;
        case 14:
        case '14':
            fields['psychometricstatus'] = 'פסיכומטרי יולי מתכוון לעשות';
            fields['Psychometricmonth'] = 'יולי';
            fields['Psychometricdate'] = new Date('7/5/2023 11:00:00');
            fields['psychometricresult'] = new Date('8/15/2023 11:00:00');
            break;
        case 13:
        case '13':
            fields['psychometricstatus'] = 'פסיכומטרי ספטמבר מתכוון לעשות';
            fields['Psychometricmonth'] = 'ספטמבר';
            fields['Psychometricdate'] = new Date('9/4/2023 11:00:00');
            fields['psychometricresult'] = new Date('10/15/2023 11:00:00');
            break;
        case 122:
        case '122':
            fields['notsurestatus'] = 'מתלבט עומד בחתכי קבלה';
            break;
        case 215:
        case '215':
            fields['notsurestatus'] = 'מתלבט -מוסד אחר';
            break;
        case 65:
        case '65':
            fields['notsurestatus'] = 'מתלבט- תחום אחר';
            break;
        case 125:
        case '125':
            fields['bagrutstatus'] = 'מתלבט צריך לשפר בגרות';
            fields['bagrutstartdate'] = new Date('4/24/2023 11:00:00');
            fields['bagrutenddate'] = new Date('7/8/2023 11:00:00');
            break;
        case 126:
        case '126':
            fields['bagrutstatus'] = 'שיפור בגרות חורף';
            fields['bagrutstartdate'] = new Date('1/1/2023 11:00:00');
            fields['bagrutenddate'] = new Date('2/8/2022 11:00:00');
            break;
        case 127:
        case '127':
            fields['bagrutstatus'] = 'שיפור בגרות קיץ';
            fields['bagrutstartdate'] = new Date('4/24/2023 11:00:00');
            fields['bagrutenddate'] = new Date('7/8/2023 11:00:00');
            break;
        case 84:
        case '84':
            fields['opendaystatus'] = 'מגיע ליום פתוח';
            fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            fields['open_day_date'] = new Date('1/27/2023 11:00:00');
            break;
        case 108:
        case '108':
            fields['opendaystatus'] = 'מגיע למפגש';
            fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            fields['open_day_date'] = new Date('1/27/2023 11:00:00');
            break;
        case 91:
        case '91':
            fields['opendaystatus'] = 'מתלבט אם להגיע למפגש';
            fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            fields['open_day_date'] = new Date('1/27/2023 11:00:00');
            break;
        case 83:
        case '83':
            fields['opendaystatus'] = 'לא מגיע ליום פתוח ';
            fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            fields['open_day_date'] = new Date('1/27/2023 11:00:00');
            break;
        case 17:
        case '17':
            fields['opendaystatus'] = 'מעוניין-רוצה להגיע ליום פתוח ';
            fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            fields['open_day_date'] = new Date('1/27/2023 11:00:00');
            break;
        case 113:
        case '113':
            fields['opendaystatus'] = 'מעוניין להגיע למפגש פתוח';
            fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            fields['open_day_date'] = new Date('1/27/2023 11:00:00');
            break;
        case 91:
        case '91':
            fields['opendaystatus'] = 'מתלבט אם להגיע ליום פתוח';
            fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            fields['open_day_date'] = new Date('1/27/2023 11:00:00');
            break;
        case 205:
        case '205':
            fields['opendaystatus'] = 'יעוץ-מעוניין להגיע ליום פתוח ';
            fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            fields['open_day_date'] = new Date('1/27/2023 11:00:00');
            break;
        case 61:
        case '61':
            fields['Postponestatus'] = 'דחית לימודים לאוקטובר הבא';
            fields['octoberdate'] = new Date('10/23/2022 10:00:00');
            break;
        case 426:
        case '426':
            fields['Postponestatus'] = 'מעוניין להירשם לאוקטובר הקרוב';
            break;
        case 60:
        case '60':
            fields['Postponestatus'] = 'דחית לימודים לסמסטר אביב';
            fields['springdate'] = new Date('2/28/2023 10:00:00');
            break;
        case 69:
        case '69':
            fields['preparesstatus'] = 'מתלבט רלבנטי למכינה';
            break;
        case 132:
        case '132':
            fields['arabic'] = 'הופנה לחברה הערבית';
            break;
        case 51:
        case '51':
            fields['closedstatus'] = 'הפסקת התעניינות';
            break;
        case 1001:
        case '1001':
            fields['closedstatus'] = 'טופל';
            break;
        case 57:
        case '57':
            fields['closedstatus'] = 'לא רלוונטי';
            break;
        case 114:
        case '114':
            fields['closedstatus'] = 'סגירה טכנית/ באישור מנהלת';
            break;
        case 131:
        case '131':
            fields['onlineregistrationstatus'] = 'הופנה לרישום מקוון';
            break;
        case 90:
        case '90':
            fields['signedup'] = 'נרשם';
            break;
        case 94:
        case '94':
            fields['signedup'] = 'נרשם ביום פתוח';
            break;
        case 400:
        case '400':
            fields['signedup'] = 'נרשם לקבוצה אחרת';
            break;
        case 33:
        case '33':
            fields['Scheduleconsultant'] = 'קביעת פגישת יעוץ-טלפונית';
            break;
        case 3:
        case '3':
            fields['Scheduleconsultant'] = 'קביעת פגישת יעוץ';
            break;
        case 85:
        case '85':
            fields['Scheduleconsultant'] = 'קביעה חוזרת –פגישת יעוץ';
            break;
        case 215:
        case '215':
            fields['Consultantresult'] = 'יעוץ-מתלבט מוסד אחר';
            break;
        case 217:
        case '217':
            fields['Consultantresult'] = 'יעוץ-מתלבט תחום אחר';
            break;
        case 220:
        case '220':
            fields['Consultantresult'] = 'יעוץ-מתלבט בין תוכניות לימודים';
            break;
        case 290:
        case '290':
            fields['Consultantresult'] = 'יעוץ-נרשם';
            break;
        case 216:
        case '216':
            fields['Consultantresult'] = 'יעוץ-מתלבט שיפורים';
            break;
        case 218:
        case '218':
            fields['Consultantresult'] = 'יעוץ-מתלבט מתי להתחיל ללמוד ';
            break;
        case 219:
        case '219':
            fields['Consultantresult'] = 'יעוץ-מתלבט טרם קיבל החלטה ';
            break;
        case 212:
        case '212':
            fields['Consultantresult'] = 'יעוץ-לא רלוונטי';
            break;
        case 221:
        case '221':
            fields['Consultantresult'] = 'יעוץ- לא הגיע לפגישה';
            break;
        case 211:
        case '211':
            fields['Consultantresult'] = 'יעוץ-רלוונטי למכינה';
            break;
        case 214:
        case '214':
            fields['Consultantresult'] = 'יעוץ-דחיית לימודים לאוקטובר';
            break;
        case 213:
        case '213':
            fields['Consultantresult'] = 'יעוץ-דחיית לימודים אביב';
            break;
        case 210:
        case '210':
            fields['Consultantresult'] = 'יעוץ-בגרות קיץ';
            break;
        case 209:
        case '209':
            fields['Consultantresult'] = 'יעוץ-בגרות חורף';
            break;
        case 208:
        case '208':
            fields['Consultantresult'] = 'יעוץ-יירשם בעתיד';
            break;
        case 200:
        case '200':
            fields['Consultantresult'] = 'יעוץ-פסיכומטרי דצמבר';
            break;
        case 203:
        case '203':
            fields['Consultantresult'] = 'יעוץ-פסיכומטרי ספטמבר';
            break;
        case 204:
        case '204':
            fields['Consultantresult'] = 'יעוץ-פסיכומטרי יולי';
            break;
        case 201:
        case '201':
            fields['Consultantresult'] = 'יעוץ-פסיכומטרי מרץ';
            break;
        case 206:
        case '206':
            fields['Consultantresult'] = 'יעוץ-מכינה לדוברי ערבית';
            break;
        case 116:
        case '116':
            fields['Consultantresult'] = 'טלמרקטינג-ביטל/דחה פגישה';
            break;

    }

    switch (mtaFields['Event_Description']) {
        case 57:
        case '57':
            fields['Clarificationcall'] = 'שיחת בירור פסיכומטרי';
            break;
        case 59:
        case '59':
            fields['Clarificationcall'] = 'שיחת בירור בגרות';
            break;
        case 60:
        case '60':
            fields['Clarificationcall'] = 'שיחת בירור דחית לימודים';
            break;
        case 61:
        case '61':
            fields['Clarificationcall'] = 'שיחת בירור הופנה לרישום';
            break;
        case 3:
        case '3':
            fields['Clarificationcall'] = 'שיחת בירור יזומה';
            break;
        case 56:
        case '56':
            fields['Clarificationcall'] = 'שיחת בירור לא ענה';
            break;
        case 58:
        case '58':
            fields['Clarificationcall'] = 'שיחת בירור מתלבט';
            break;
        case 50:
        case '50':
            fields['Clarificationcall'] = 'חברה ערבית שיחת בירור ';
            break;
    }

    return fields;
}