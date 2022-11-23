export const toMautic = (mtaFields: Record<string, any>): Record<string, any> => {
    const fields = {
        firstname: mtaFields['FirstName'],
        lastname: mtaFields['Surname'],
        mobile: mtaFields['Phone_Number_3'],
        email: mtaFields['Home_email'] && mtaFields['Home_email'].trim() || mtaFields['Phone_Number_3'] + '@email.com',
        studytype: mtaFields['Description_of_Group'] || 'empty',
        //mailingconfirmation: mtaFields['ApproveMail'] || 'empty', // lead tbl
        newleaddate: mtaFields['Creation_Date'],
        //signupdate: mtaFields['RegistrationDate'],
        //Consultantname: mtaFields['Name_of_Consultant'],
        Consultdate: mtaFields['Planned_Date'],
        Consulthour: mtaFields['Scheduled_Hour'],
        yearstartdate: new Date('October 23, 2022 11:00 AM'),
        yearstartmonth: 'October',
        nextyearstartdate: new Date('October 22, 2023 11:00 AM'),
        nextyearstartmonth: 'October',
    };

    if([1, 2].includes(+mtaFields['Event_Description'])) {
        fields['mainleadstatus'] = "חדש";
    } else if ([4, 5].includes(+mtaFields['Event_Description'])) {
        fields['mainleadstatus'] = "פגישת יעוץ";
    } else {
        fields['mainleadstatus'] = "בתהליך";
    }

    switch (+mtaFields['Event_Description_Code']) {
        case 1:
            fields['leadsource'] = 'קליטת ליד מהאינטרנט';
            break;
        case 2:
            fields['leadsource'] = 'קליטת ליד טלפונית';
            break;
        case 4:
            fields['consultantname'] = mtaFields['Name_of_Consultant'];
            break;
        case 57:
            fields['clarificationcall'] = 'שיחת בירור פסיכומטרי';
            break;
        case 59:
            fields['clarificationcall'] = 'שיחת בירור בגרות';
            break;
        case 60:
            fields['clarificationcall'] = 'שיחת בירור דחית לימודים';
            break;
        case 61:
            fields['clarificationcall'] = 'שיחת בירור הופנה לרישום';
            break;
        case 3:
            fields['clarificationcall'] = 'שיחת בירור יזומה';
            break;
        case 56:
            fields['clarificationcall'] = 'שיחת בירור לא ענה';
            break;
        case 58:
            fields['clarificationcall'] = 'שיחת בירור מתלבט';
            break;
        case 50:
            fields['clarificationcall'] = 'חברה ערבית שיחת בירור ';
            break;
    }

    switch (mtaFields['Result_Description']) {
        case 'קביעת פגישת יעוץ - וידאו':
            fields['scheduleconsultant'] = 'קביעת פגישת יעוץ - וידאו';
            break;
        case 'יעוץ-מתלבט עומד בחתכי קבלה':
            fields['consultantresult'] = 'יעוץ-מתלבט עומד בחתכי קבלה';
    }

    switch (+mtaFields['Result_Description_Code']) {
        case 106:
            fields['didntanswer'] = 'לא ענה שיחת בירור';
            break;
        case 104:
            fields['didntanswer'] = 'לא ענה פעמיים-אין תא קולי';
            break;
        case 117:
            fields['didntanswer'] = 'אין מענה 3 פעמים';
            break;
        case 58:
            fields['didntanswer'] = 'לא ענה 5 פעמים-SMS';
            break;
        case 123:
            fields['psychometricstatus'] = ' מתלבט צריך לשפר פסיכומטרי';
            break;
        case 124:
            fields['psychometricstatus'] = 'מתלבט צריך להשלים פסיכומטרי';
            break;
        case 10:
            fields['psychometricstatus'] = 'פסיכומטרי דצמבר מתכוון לעשות';
            fields['psychometricmonth'] = 'דצמבר';
            fields['Psychometricdate'] = new Date('12/23/2022 11:38:00');
            fields['psychometricresult'] = new Date('2/2/2023 11:00:00');
            break;
        case 11:
            fields['psychometricstatus'] = 'פסיכומטרי מרץ מתכוון לעשות';
            fields['psychometricmonth'] = 'מרץ';
            fields['Psychometricdate'] = new Date('4/2/2023 11:00:00');
            fields['psychometricresult'] = new Date('5/16/2022 11:00:00');
            break;
        case 14:
            fields['psychometricstatus'] = 'פסיכומטרי יולי מתכוון לעשות';
            fields['psychometricmonth'] = 'יולי';
            fields['Psychometricdate'] = new Date('7/5/2023 11:00:00');
            fields['psychometricresult'] = new Date('8/15/2023 11:00:00');
            break;
        case 13:
            fields['psychometricstatus'] = 'פסיכומטרי ספטמבר מתכוון לעשות';
            fields['psychometricmonth'] = 'ספטמבר';
            fields['Psychometricdate'] = new Date('9/4/2023 11:00:00');
            fields['psychometricresult'] = new Date('10/15/2023 11:00:00');
            break;
        case 122:
            fields['notsurestatus'] = 'מתלבט עומד בחתכי קבלה';
            break;
        case 65:
            fields['notsurestatus'] = 'מתלבט- תחום אחר';
            break;
        case 68:
            fields['notsurestatus'] = 'מתלבט בין תוכניות לימודים';
            break;
        case 125:
            fields['bagrutstatus'] = 'מתלבט צריך לשפר בגרות';
            fields['bagrutstartdate'] = new Date('4/24/2023 11:00:00');
            fields['bagrutenddate'] = new Date('7/8/2023 11:00:00');
            break;
        case 126:
            fields['bagrutstatus'] = 'שיפור בגרות חורף';
            fields['bagrutstartdate'] = new Date('1/1/2023 11:00:00');
            fields['bagrutenddate'] = new Date('2/8/2022 11:00:00');
            break;
        case 127:
            fields['bagrutstatus'] = 'שיפור בגרות קיץ';
            fields['bagrutstartdate'] = new Date('4/24/2023 11:00:00');
            fields['bagrutenddate'] = new Date('7/8/2023 11:00:00');
            break;
        case 84:
            fields['opendaystatus'] = 'מגיע ליום פתוח';
            fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            fields['open_day_date'] = new Date('1/27/2023 11:00:00');
            break;
        case 108:
            fields['opendaystatus'] = 'מגיע למפגש';
            fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            fields['open_day_date'] = new Date('1/27/2023 11:00:00');
            break;
        case 91:
            fields['opendaystatus'] = 'מתלבט אם להגיע למפגש';
            fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            fields['open_day_date'] = new Date('1/27/2023 11:00:00');

            // fields['opendaystatus'] = 'מתלבט אם להגיע ליום פתוח';
            // fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            // fields['open_day_date'] = new Date('1/27/2023 11:00:00');
            break;
        case 83:
            fields['opendaystatus'] = 'לא מגיע ליום פתוח ';
            fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            fields['open_day_date'] = new Date('1/27/2023 11:00:00');
            break;
        case 17:
            fields['opendaystatus'] = 'מעוניין-רוצה להגיע ליום פתוח ';
            fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            fields['open_day_date'] = new Date('1/27/2023 11:00:00');
            break;
        case 113:
            fields['opendaystatus'] = 'מעוניין להגיע למפגש פתוח';
            fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            fields['open_day_date'] = new Date('1/27/2023 11:00:00');
            break;
        case 205:
            fields['opendaystatus'] = 'יעוץ-מעוניין להגיע ליום פתוח ';
            fields['open_day_segment'] = new Date('5/28/2022 10:00:00');
            fields['open_day_date'] = new Date('1/27/2023 11:00:00');
            break;
        case 61:
            fields['postponestatus'] = 'דחית לימודים לאוקטובר הבא';
            fields['octoberdate'] = new Date('10/23/2022 10:00:00');
            break;
        case 426:
            fields['postponestatus'] = 'מעוניין להירשם לאוקטובר הקרוב';
            break;
        case 60:
            fields['postponestatus'] = 'דחית לימודים לסמסטר אביב';
            fields['springdate'] = new Date('2/28/2023 10:00:00');
            break;
        case 69:
            fields['preparesstatus'] = 'מתלבט רלבנטי למכינה';
            break;
        case 132:
            fields['arabic'] = 'הופנה לחברה הערבית';
            break;
        case 51:
            fields['closedstatus'] = 'הפסקת התעניינות';
            break;
        case 1001:
            fields['closedstatus'] = 'טופל';
            break;
        case 57:
            fields['closedstatus'] = 'לא רלוונטי';
            break;
        case 114:
            fields['closedstatus'] = 'סגירה טכנית/ באישור מנהלת';
            break;
        case 131:
            fields['onlineregistrationstatus'] = 'הופנה לרישום מקוון';
            break;
        case 90:
            fields['signedup'] = 'נרשם';
            break;
        case 94:
            fields['signedup'] = 'נרשם ביום פתוח';
            break;
        case 400:
            fields['signedup'] = 'נרשם לקבוצה אחרת';
            break;
        case 81:
            fields['counselingstatus'] = 'מגיע לפגישה';
            break;
        case 87:
            fields['counselingstatus'] = 'לא מגיע לפגישה';
            break;
        case 82:
            fields['counselingstatus'] = 'דחיית מועד פגישה';
            break;
        case 33:
            fields['scheduleconsultant'] = 'קביעת פגישת יעוץ-טלפונית';
            break;
        case 3:
            fields['scheduleconsultant'] = 'קביעת פגישת יעוץ';
            break;
        case 85:
            fields['scheduleconsultant'] = 'קביעה חוזרת –פגישת יעוץ';
            break;
        case 215:
            fields['consultantresult'] = 'יעוץ-מתלבט מוסד אחר';
            fields['notsurestatus'] = 'מתלבט -מוסד אחר';
            break;
        case 217:
            fields['consultantresult'] = 'יעוץ-מתלבט תחום אחר';
            break;
        case 220:
            fields['consultantresult'] = 'יעוץ-מתלבט בין תוכניות לימודים';
            break;
        case 290:
            fields['consultantresult'] = 'יעוץ-נרשם';
            break;
        case 216:
            fields['consultantresult'] = 'יעוץ-מתלבט שיפורים';
            break;
        case 218:
            fields['consultantresult'] = 'יעוץ-מתלבט מתי להתחיל ללמוד ';
            break;
        case 219:
            fields['consultantresult'] = 'יעוץ-מתלבט טרם קיבל החלטה ';
            break;
        case 212:
            fields['consultantresult'] = 'יעוץ-לא רלוונטי';
            break;
        case 221:
            fields['consultantresult'] = 'יעוץ- לא הגיע לפגישה';
            break;
        case 211:
            fields['consultantresult'] = 'יעוץ-רלוונטי למכינה';
            break;
        case 214:
            fields['consultantresult'] = 'יעוץ-דחיית לימודים לאוקטובר';
            break;
        case 213:
            fields['consultantresult'] = 'יעוץ-דחיית לימודים אביב';
            break;
        case 210:
            fields['consultantresult'] = 'יעוץ-בגרות קיץ';
            break;
        case 209:
            fields['consultantresult'] = 'יעוץ-בגרות חורף';
            break;
        case 208:
            fields['consultantresult'] = 'יעוץ-יירשם בעתיד';
            break;
        case 200:
            fields['consultantresult'] = 'יעוץ-פסיכומטרי דצמבר';
            break;
        case 203:
            fields['consultantresult'] = 'יעוץ-פסיכומטרי ספטמבר';
            break;
        case 204:
            fields['consultantresult'] = 'יעוץ-פסיכומטרי יולי';
            break;
        case 201:
            fields['consultantresult'] = 'יעוץ-פסיכומטרי מרץ';
            break;
        case 206:
            fields['consultantresult'] = 'יעוץ-מכינה לדוברי ערבית';
            break;
        case 116:
            fields['consultantresult'] = 'טלמרקטינג-ביטל/דחה פגישה';
            break;

    }
    switch (String(mtaFields['Result_Description_Code'])) {
        case 'אין':
            fields['didntanswer'] = 'לא ענה פעם 1';
            break;
    }


    return fields;
}
