import "cypress-mailslurp";
import { faker } from "@faker-js/faker";

const nomTableau = faker.random.word();
const nomListe1 = faker.random.word();
const nomListe2 = faker.random.word();
const nomCarte = faker.random.word();
const descriptionCarte = faker.lorem.sentence();
const home = "https://trello.com/home";
const password = "Test-123-456";
const board = "https://trello.com/u/00b301ccc2f2476497ce4f8528712df6/boards";
const firstMail = "00b301cc-c2f2-4764-97ce-4f8528712df6@mailslurp.com";
const secMail = "94db1f4c-f721-4692-a411-847a622bdaef@mailslurp.com";

describe.skip("template spec", () => {
  //Inscription

  beforeEach(() => {
    cy.visit(home);
    cy.get(
      '.Buttonsstyles__ButtonGroup-sc-1jwidxo-3 > [href="/login"]'
    ).click();
    cy.url().should("include", "/login");
  });

  //CAS_01_Inscription: Parcours d'inscription par Mailslurp

  it("Register", () => {
    cy.task("createInbox").then((inbox) => {
      cy.get("#user").type(inbox.emailAddress);
      cy.get(".signupLink").click();
      cy.url().should("include", "/signup");
      cy.get('[data-testid="signup-submit"]').should("be.visible").click();
    });
  });
});

describe("Action sur Trello", () => {
  beforeEach(() => {
    //connexion à TRELLO

    cy.visit(home);
    cy.get(
      "#BXP-APP > header.BigNavstyles__Header-sc-1mttgq7-1.hNNfeR > div > div.BigNavstyles__NavBar-sc-1mttgq7-3.caTbTe > div.Buttonsstyles__ButtonGroup-sc-1jwidxo-3.jnMZCI > a:nth-child(1)"
    ).click();
    cy.wait(1000);
    cy.url().should("eql", "https://trello.com/login");
    cy.get("#user").type(firstMail);
    cy.get("#login").click();
    cy.wait(1000);
    cy.origin("https://id.atlassian.com", () => {
      cy.get("#password").type("Test-123-456");
      cy.get("#login-submit").click();
    });
  });

  after(() => {
    //supprimer le tableau

    cy.visit(board);
    cy.get('[data-testid="home-team-boards-tab"]').click();
    cy.get(".board-tile-details").contains(nomTableau).click();
    cy.wait(500);
    cy.get(
      '.GDunJzzgFqQY_3 > .nch-icon > [data-testid="OverflowMenuHorizontalIcon"]'
    ).click();
    cy.get(":nth-child(5) > .board-menu-navigation-item-link").click();
    cy.get(
      ":nth-child(5) > .board-menu-navigation-item > .board-menu-navigation-item-link"
    ).click();
    cy.get(".pop-over-content > :nth-child(1) > div > [data-testid]").click();
    cy.get('[data-testid="close-board-delete-board-button"]').click();
    cy.get('[data-testid="close-board-delete-board-confirm-button"]').click();
    cy.url().should("contain", "home");
  });

  it("CAS_02_Tableau", () => {
    // CAS_02_Tableau_Création d'un tableau

    cy.url().should("eql", board);
    cy.wait(1000);
    cy.get('[data-testid="create-board-tile"] > .board-tile').click();
    cy.get('[data-testid="create-board-title-input"]').type(nomTableau);
    cy.get('[data-testid="create-board-submit-button"]').click();
    cy.get('[data-testid="board-name-display"]').should(
      "have.text",
      nomTableau
    );
  });

  it("CAS_03_Liste", () => {
    // CAS_03_Liste_Création d'une liste

    cy.url().should("eql", board);
    cy.wait(1000);
    cy.get(
      ".rVz43wK3rQUlj3 > :nth-child(1) > .oTmCsFlPhDLGz2 > .DD3DlImSMT6fgc"
    ).click();
    cy.get(".board-tile-details").contains(nomTableau).click();
    cy.get(".js-add-list").click();
    cy.get(".list-name-input").type(nomListe1);
    cy.get(".list-add-controls > .nch-button").click();
    cy.get("#board").should("contain", nomListe1); // Vérifier l'existence de la liste créée
  });

  it("CAS_04_Carte, CAS_05_Carte_déplacement, CAS_06_Carte_modification, CAS_07_Carte_suppression", () => {
    // CAS_04_Carte : création d'une carte

    cy.url().should("eql", board);
    cy.wait(1000);
    cy.get(
      ".rVz43wK3rQUlj3 > :nth-child(1) > .oTmCsFlPhDLGz2 > .DD3DlImSMT6fgc"
    ).click();
    cy.get(".board-tile-details").contains(nomTableau).click();
    cy.get(
      ":nth-child(1) > .list > .card-composer-container > .open-card-composer"
    ).click();
    cy.get(".list-card-composer-textarea").type(nomCarte);
    cy.get(".cc-controls-section > .nch-button").click();
    cy.get(".list-card-title").should("contain", nomCarte); // Vérifier l'existence de la carte créée

    // Création d'une 2e liste pour y déplacer la carte

    cy.get(".js-add-list").click();
    cy.get(".list-name-input").type(nomListe2);
    cy.get(".list-add-controls > .nch-button").click();

    // CAS_05_Carte_déplacement : déplacement d'une carte

    cy.get(".active-card > .list-card-details").click();
    cy.get(".js-move-card").click();
    cy.get('[data-testid="move-card-popover-select-list-destination"]').select(
      nomListe2
    ); //
    cy.get('[data-testid="move-card-popover-move-button"]').click();
    cy.get(".icon-md").click();
    cy.get("#board").should("contain", nomCarte); // Vérifier l'existence de la carte créée dans la liste ciblée

    // CAS_06_Carte_modification: modification du contenu d'une carte

    cy.get(".list-card-title").contains(nomCarte).click();
    cy.get('[data-testid="click-wrapper"]').type(descriptionCarte);
    cy.get(".js-save-edit").contains("Sauvegarder").click();
    cy.get(".icon-md").click();
    cy.get(".badge-icon").should("exist"); // Vérifier l'existence d'une description sur la carte

    // CAS_07_Carte_suppression: suppression d'une carte

    cy.get('[data-testid="trello-card"] > .list-card-details').click();
    cy.get(".js-archive-card").click();
    cy.get(".js-delete-card").click();
    cy.get(".pop-over-content > :nth-child(1) > div > [data-testid]").click();
    cy.get("#board").should("not.contain", nomCarte); // Vérifier que la carte n'est plus présente dans la liste
  });

  it("CAS_08_Membre", () => {
    // CAS_08_CAS_08_Membre: Ajouter un membre au board

    cy.get(".board-tile-details").should("contain", nomTableau); //Vérifier que le tableau créé précédemment existe
    cy.get(".board-tile-details").contains("test").click();
    cy.get('[data-testid="board-share-button"]').click();
    cy.get('[data-testid="add-members-input"]').type(secMail);
    cy.wait(1000);
    cy.get(".member-container").click();
    cy.wait(1000);
    cy.get('[data-testid="team-invite-submit-button"]').click({ force: true });
    cy.get(".member-container");
    cy.wait(1000);
    cy.mailslurp()
      .then((mailslurp) =>
        mailslurp.waitForLatestEmail(
          "94db1f4c-f721-4692-a411-847a622bdaef",
          10000,
          true
        )
      )
      .then((email) => {
        cy.document().invoke("write", email.body);
        cy.get('[style="margin: 24px 0; line-height: 32px;"] > a').click();
        cy.visit("https://trello.com/b/XH2nBffp/test");
        cy.get('[data-testid="board-share-button"]').click();
        cy.get(
          ':nth-child(2) > :nth-child(3) > [data-testid="board-permission-selector"] > div > [data-testid="board-permission-selector-dropdown--trigger"]'
        ).click();
        cy.get(":nth-child(2) > .css-1xg4o0").click();
        cy.wait(1000);
        cy.get(
          '[data-testid="confirm-remove-deactived-member-button"]'
        ).click();
        cy.wait(1000);
        cy.reload();
        cy.wait(1000);
      });
  });

  /*it.only('Premium', () => {

     CAS_09_Premium: Activer un compte premium (gratuit)

      
      cy.get('[data-testid="team-home-sidebar-upgrade-prompt"]').click();
      cy.get('[data-testid="start-free-trial-button"]').click();
      })*/
});
//
