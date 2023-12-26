import { fake } from "Fixtures/fake";
import { commonSelectors, commonWidgetSelector } from "Selectors/common";
import {
    fillDataSourceTextField,
    selectAndAddDataSource,
    fillConnectionForm,
} from "Support/utils/postgreSql";
import { commonText } from "Texts/common";
import {
    closeDSModal,
    deleteDatasource,
    addQuery,
    addQueryN,
    verifyValueOnInspector,
    resizeQueryPanel
} from "Support/utils/dataSource";
import { dataSourceSelector } from "Selectors/dataSource";
import { dataSourceText } from "Texts/dataSource";
import { addNewUserMW } from "Support/utils/userPermissions";
import { groupsSelector } from "Selectors/manageGroups";
import { eeGroupsSelector } from "Selectors/eeCommon";
import {
    logout,
    navigateToAppEditor,
    navigateToManageGroups,
    pinInspector,
    createGroup,
} from "Support/utils/common";

import { AddDataSourceToGroup } from "Support/utils/eeCommon";

const data = {};
data.userName1 = fake.firstName.toLowerCase().replaceAll("[^A-Za-z]", "");
data.userEmail1 = fake.email.toLowerCase();
data.ds1 = fake.lastName.toLowerCase().replaceAll("[^A-Za-z]", "");
data.ds2 = fake.lastName.toLowerCase().replaceAll("[^A-Za-z]", "");
data.ds3 = fake.lastName.toLowerCase().replaceAll("[^A-Za-z]", "");
data.appName = `${fake.companyName}-App`;

describe("Global Datasource Manager", () => {
    beforeEach(() => {
        cy.apiLogin();
        cy.visit('/my-workspace')
        cy.viewport(1200, 1300);
        cy.wait(1000)
    });

    before(() => {
        cy.apiLogin();
        cy.apiCreateApp(data.appName);
        cy.visit('/my-workspace')
        addNewUserMW(data.userName1, data.userEmail1);
        cy.logoutApi();
    });

    it("Should verify the global data source manager UI", () => {
        cy.get(commonSelectors.globalDataSourceIcon).click();
        cy.get(commonSelectors.pageSectionHeader).verifyVisibleElement(
            "have.text",
            "Data sources"
        );
        cy.get(dataSourceSelector.allDatasourceLabelAndCount).verifyVisibleElement(
            "have.text",
            dataSourceText.allDataSources
        );
        cy.get(commonSelectors.breadcrumbTitle).should(($el) => {
            expect($el.contents().first().text().trim()).to.eq("Data sources");
        });

        cy.get(dataSourceSelector.databaseLabelAndCount).verifyVisibleElement(
            "have.text",
            dataSourceText.allDatabase
        );
        cy.get(commonSelectors.breadcrumbPageTitle).verifyVisibleElement(
            "have.text",
            "Databases"
        );
        cy.get(dataSourceSelector.querySearchBar)
            .invoke("attr", "placeholder")
            .should("eq", "Search Databases");

        cy.get(dataSourceSelector.apiLabelAndCount)
            .verifyVisibleElement("have.text", dataSourceText.allApis)
            .click();
        cy.get(commonSelectors.breadcrumbPageTitle).verifyVisibleElement(
            "have.text",
            "APIs"
        );
        cy.get(dataSourceSelector.querySearchBar)
            .invoke("attr", "placeholder")
            .should("eq", "Search APIs");

        cy.get(dataSourceSelector.cloudStorageLabelAndCount)
            .verifyVisibleElement("have.text", dataSourceText.allCloudStorage)
            .click();
        cy.get(commonSelectors.breadcrumbPageTitle).verifyVisibleElement(
            "have.text",
            "Cloud Storage"
        );
        cy.get(dataSourceSelector.querySearchBar)
            .invoke("attr", "placeholder")
            .should("eq", "Search Cloud Storage");

        cy.get(dataSourceSelector.pluginsLabelAndCount)
            .verifyVisibleElement("have.text", dataSourceText.pluginsLabelAndCount)
            .click();
        cy.get(commonSelectors.breadcrumbPageTitle).verifyVisibleElement(
            "have.text",
            "Plugins"
        );
        cy.get(dataSourceSelector.querySearchBar)
            .invoke("attr", "placeholder")
            .should("eq", "Search Plugins");

        cy.get('[data-cy="added-ds-label"]').should(($el) => {
            expect($el.contents().first().text().trim()).to.eq("Data sources added");
        });
        cy.get(dataSourceSelector.addedDsSearchIcon).should("be.visible").click();
        cy.get(dataSourceSelector.AddedDsSearchBar)
            .invoke("attr", "placeholder")
            .should("eq", "Search for Data sources");

        selectAndAddDataSource("databases", dataSourceText.postgreSQL, data.ds1);
        cy.clearAndType(
            dataSourceSelector.dsNameInputField,
            `cypress-${data.ds1}-postgresql1`
        );

        cy.get(dataSourceSelector.databaseLabelAndCount).click();

        cy.get(commonSelectors.modalComponent).should("be.visible");
        cy.get(dataSourceSelector.unSavedModalTitle).verifyVisibleElement(
            "have.text",
            dataSourceText.unSavedModalTitle
        );
        cy.get(commonWidgetSelector.modalCloseButton).should("be.visible");
        cy.get(commonSelectors.cancelButton)
            .should("be.visible")
            .and("have.text", commonText.saveChangesButton);
        cy.get(commonSelectors.yesButton).verifyVisibleElement(
            "have.text",
            "Discard"
        );

        cy.get(commonWidgetSelector.modalCloseButton).click();
        cy.get(dataSourceSelector.buttonSave).should("be.enabled");

        cy.get(dataSourceSelector.databaseLabelAndCount).click();
        cy.get(commonSelectors.yesButton).click();
        cy.get(commonSelectors.breadcrumbPageTitle).verifyVisibleElement(
            "have.text",
            "Databases"
        );
        cy.wait(200)
        cy.get(`[data-cy="cypress-${data.ds1}-postgresql-button"]`).realClick();
        cy.clearAndType(
            dataSourceSelector.dsNameInputField,
            `cypress-${data.ds1}-postgresql1`
        );
        cy.get(commonSelectors.dashboardIcon).click();
        cy.get(commonSelectors.yesButton).click();

        cy.get(commonSelectors.appCreateButton).should("be.visible");
        cy.get(commonSelectors.globalDataSourceIcon).click();
        cy.get(dataSourceSelector.databaseLabelAndCount).click();
        cy.wait(500)
        cy.get(`[data-cy="cypress-${data.ds1}-postgresql-button"]`).realClick();
        cy.clearAndType(
            dataSourceSelector.dsNameInputField,
            `cypress-${data.ds1}-postgresql1`
        );
        cy.get(commonSelectors.dashboardIcon).click();
        cy.get(commonSelectors.cancelButton).click();
        cy.verifyToastMessage(
            commonSelectors.toastMessage,
            dataSourceText.toastDSSaved
        );

        cy.get(
            `[data-cy="cypress-${data.ds1}-postgresql1-button"]`
        ).verifyVisibleElement("have.text", `cypress-${data.ds1}-postgresql1`);

        deleteDatasource(`cypress-${data.ds1}-postgresql1`);
    });
    it("Should verify the Datasource connection and query creation using global data source", () => {
        selectAndAddDataSource("databases", dataSourceText.postgreSQL, data.ds1);

        cy.clearAndType(
            dataSourceSelector.dsNameInputField,
            `cypress-${data.ds1}-postgresql`
        );

        fillConnectionForm(
            {
                Host: Cypress.env("pg_host"),
                Port: "5432",
                "Database Name": Cypress.env("pg_user"),
                Username: Cypress.env("pg_user"),
                Password: Cypress.env("pg_password"),
            },
            ".form-switch"
        );

        cy.get(commonSelectors.globalDataSourceIcon).click();
        cy.get(commonSelectors.dashboardIcon).click();
        navigateToAppEditor(data.appName);

        pinInspector();
        // cy.get(".tooltip-inner").invoke("hide");

        addQuery(
            "table_preview",
            `SELECT * FROM Persons;`,
            `cypress-${data.ds1}-postgresql`
        );

        cy.get('[data-cy="list-query-table_preview"]').verifyVisibleElement(
            "have.text",
            "table_preview "
        );

        cy.wait(500);
        cy.get(dataSourceSelector.queryCreateAndRunButton).click();
        pinInspector();
        verifyValueOnInspector('table_preview', "7 items ")

        cy.get('[data-cy="show-ds-popover-button"]').click();
        cy.get(".p-2 > .tj-base-btn")
            .should("be.visible")
            .and("have.text", "+ Add new Data source");
        cy.get(".p-2 > .tj-base-btn").click();

        selectAndAddDataSource("databases", dataSourceText.postgreSQL, data.ds2);
        fillConnectionForm(
            {
                Host: Cypress.env("pg_host"),
                Port: "5432",
                "Database Name": Cypress.env("pg_user"),
                Username: Cypress.env("pg_user"),
                Password: Cypress.env("pg_password"),
            },
            ".form-switch"
        );
    });
    it("Should validate the user's global data source permissions on apps created by admin", () => {
        navigateToManageGroups();
        cy.get(groupsSelector.appSearchBox).click();
        cy.get(groupsSelector.searchBoxOptions).contains(data.appName).click();
        cy.get(groupsSelector.selectAddButton).click();
        cy.contains("tr", data.appName)
            .parent()
            .within(() => {
                cy.get("td input").eq(1).check();
            });
        cy.verifyToastMessage(
            commonSelectors.toastMessage,
            "App permissions updated"
        );

        AddDataSourceToGroup("All users", `cypress-${data.ds1}-postgresql`);
        AddDataSourceToGroup("All users", `cypress-${data.ds2}-postgresql`);

        cy.logoutApi();
        cy.apiLogin(data.userEmail1, "password");
        cy.visit('/my-workspace')

        navigateToAppEditor(data.appName);
        cy.get('[data-cy="list-query-table_preview"]').verifyVisibleElement(
            "have.text",
            "table_preview "
        );
        cy.wait(500);
        cy.get(dataSourceSelector.queryCreateAndRunButton).click();

        pinInspector();
        verifyValueOnInspector('table_preview', "7 items ")

        cy.get('[data-cy="show-ds-popover-button"]').click();
        cy.wait(2000)
        addQueryN(
            "student_data",
            `SELECT * FROM student_data;`,
            `cypress-${data.ds2}-postgresql`
        );

        cy.get('[data-cy="list-query-student_data"]').verifyVisibleElement(
            "have.text",
            "student_data "
        );
        cy.wait(500);
        cy.get(dataSourceSelector.queryCreateAndRunButton).click();
        verifyValueOnInspector('table_preview', "8 items ")

        cy.get(".p-2 > .tj-base-btn").should("not.exist");
    });
    it("Should verify the query creation and scope changing functionality.", () => {
        data.appName = `${fake.companyName}-App`;
        selectAndAddDataSource("databases", dataSourceText.postgreSQL, data.ds3);
        cy.clearAndType(
            dataSourceSelector.dsNameInputField,
            `cypress-${data.ds3}-postgresql`
        );

        fillConnectionForm(
            {
                Host: Cypress.env("pg_host"),
                Port: "5432",
                "Database Name": Cypress.env("pg_user"),
                Username: Cypress.env("pg_user"),
                Password: Cypress.env("pg_password"),
            },
            ".form-switch"
        );

        navigateToManageGroups();
        cy.get(groupsSelector.permissionsLink).click();
        cy.get(groupsSelector.appsCreateCheck).then(($el) => {
            if (!$el.is(":checked")) {
                cy.get(groupsSelector.appsCreateCheck).check();
            }
        });
        AddDataSourceToGroup("All users", `cypress-${data.ds3}-postgresql`);

        cy.logoutApi();
        cy.apiLogin(data.userEmail1, "password");
        cy.apiCreateApp(data.appName);
        cy.openApp();

        resizeQueryPanel("80");
        cy.wait(2000);
        addQuery(
            "table_preview",
            `SELECT * FROM Persons;`,
            `cypress-${data.ds3}-postgresql`
        );

        cy.get('[data-cy="list-query-table_preview"]').verifyVisibleElement(
            "have.text",
            "table_preview "
        );

        cy.wait(500);
        cy.get(dataSourceSelector.queryCreateAndRunButton).click();

        pinInspector();
        cy.get("body").then(($body) => {
            if ($body.find(".tooltip-inner").length > 0) {
                cy.get(".tooltip-inner").invoke("hide");
            }
        });
        cy.get('[data-cy="inspector-node-queries"]')
            .parent()
            .within(() => {
                cy.get("span").first().scrollIntoView().contains("queries").click();
            });
        cy.get('[data-cy="inspector-node-table_preview"] > .node-key').click();
        cy.get('[data-cy="inspector-node-data"] > .fs-9').verifyVisibleElement(
            "have.text",
            "7 items "
        );
    });
});