import { onDatepickerPage } from "../support/page_objects/datepickerPage"
import { onFormLayoutsPage } from "../support/page_objects/formLayoutsPage"
import {navigateTo} from "../support/page_objects/navigationPage"

describe('Tests with Page Objects', () => {
 beforeEach('open application', () => {
     cy.openHomePage()
 })
 it('verify navigationa across the pages', () => {
     navigateTo.formLayoutsPage()
     navigateTo.datepickerPage()
     navigateTo.smartTablePage()
     navigateTo.toasterPage()
     navigateTo.tooltipPage()
 })
 it.only('should submit Inline and Basic form and select tomorrow date in the callender', () => {
    // navigateTo.formLayoutsPage()
    // onFormLayoutsPage.submitInlineFormWithNameAndEmail('Test', 'test@test.com')
    // onFormLayoutsPage.submitBasicFormWithEmailAndPassword('test@test.com','password')
    navigateTo.datepickerPage()
    onDatepickerPage.selctCommonDatepickerDateFromToday(1)

 })
})