/// <reference types="cypress" />

describe('Our first suite', () => {

    it('first test', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()


        // by Tag Name
        cy.get('input')

        //by ID
        cy.get('#inputEmail1')

        //by Class name
        cy.get('.input-full-width')

        //by Attribute name
        cy.get('[placeholder]')
        
        //by Attribute name and value
        cy.get('[placeholder="Email"]')

        //by class value
        cy.get('[class="input-full-width size-medium shape-rectangle"]')

        //by Tag name and Attribute value
        cy.get('input[placeholder="Email"]')
        
        //by two different attributes
        cy.get('[placeholder="Email"][type="email"]')

        //by tag name, Attribute with value, id, and class name
        cy.get('input[placeholder="Email"]#inputEmail1.input-full-width')
    })

    it('second test', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.get('[data-cy="signInButton"]')

        cy.contains('Sign in')

        cy.contains('[status="warning"]','Sign in')

        cy.get('#inputEmail3')
            .parents('form')
            .find('button')
            .should('contain', 'Sign in')
            .parents('form')
            .find('nb-checkbox')
            .click()
            
        cy.contains('nb-card','Horizontal form').find('[type="email]')

    })
    it('then and wrap methods', () =>{

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        // cy.contains('nb-card','Using the Grid').find('[for="inputEmail1"]').should('contain', 'Email')
        // cy.contains('nb-card','Using the Grid').find('[for="inputPassword2"]').should('contain', 'Password')
        //bez duplikacji
        cy.contains('nb-card','Using the Grid').then( firstForm => {
            const emailLabel1 = firstForm.find('[for="inputEmail1"]').text()
            const passwordLabel1 = firstForm.find('[for="inputPassword2"]').text()
            expect(emailLabel1).to.equal('Email')
            expect(passwordLabel1).to.equal('Password')
            //wykorzystując then metody w niej są typu JQuery i nir można wykorzystywać metod cypressa jak click

            cy.contains('nb-card','Basic form').then( secondForm => {
                const passwordLabel2 = secondForm.find('[for="exampleInputPassword1"]').text()
                expect(passwordLabel2).to.equal('Password')
                expect(passwordLabel1).to.equal(passwordLabel2)
                //wrap pozwala zmienić obiekty z typu JQuery na typ HTMLElement, 
                //przywracając kontext cypressa i pozwalając na wykorzytywanie jego metod
                cy.wrap(secondForm).find('[for="exampleInputPassword1"]').should('contain', 'Password')
            })
    })
})

    it('invoke command', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //sposoby na pobranie textu z elementu i porównanie ze wzorcem

        //1
        cy.get('[for="exampleInputEmail1"]').should('contain','Email address')

        //2
        cy.get('[for="exampleInputEmail1"]').then( label =>{ 
            expect(label.text()).to.equal('Email address')
        })

        //3
        cy.get('[for="exampleInputEmail1"]').invoke('text').then( text => {
            expect(text).to.equal('Email address')
        })

        // przykład wykorzystania metody invoke dla sprawdzenia czy element jest zaznaczony
        cy.contains('nb-card', 'Basic form')
        .find('nb-checkbox')
        .click()
        .find('.custom-checkbox')
        .invoke('attr', 'class')
        //.should('contain', 'checked')
        //drugi sposób
        .then(classValue => {
        expect(classValue).to.contain('checked')
    })

    })

    it('assert property value', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()

        cy.contains('nb-card', 'Common Datepicker').find('input').then( input => {
            cy.wrap(input).click()
            cy.get('nb-calendar-day-picker').contains('17').click()
            cy.wrap(input).invoke('prop', 'value').should('contain','Feb 17, 2021')
        })

    })

    it('radio button', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then(radioButtons => {
            cy.wrap(radioButtons)
                .first()
                .check({force: true})
                .should('be.checked')

            cy.wrap(radioButtons)
                .eq(1)
                .check({force: true})
        
            cy.wrap(radioButtons)
                .first()
                .should('not.be.checked')
            cy.wrap(radioButtons)
                .eq(2)   
                .should('be.disabled') 
        })
    })
    it('checkboxes', () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click()

        cy.get('[type="checkbox"]').check({force:true})
        // metoda check, wykona się(w tym przypadku) na wszystkich checkboxach ale nie odznaczy już zaznaczonych checkboxów
        //żeby odznaczyć zaznaczony chceckbox trzeba skorzstać z metody click
        cy.get('[type="checkbox"]').eq(0).click({force:true})

    })
    it('dropdown 1', () => {
        cy.visit('/')
        //sprawdzenie klikalności i zmiany dla jednego elementu listy
        cy.get('nav nb-select').click()//otwiera dropdown ale ten jest w innym miejscu dom, więc trzeba wyszukać go ponownie
        cy.get('.options-list').contains('Dark').click()
        cy.get('nav nb-select').should('contain', 'Dark')
        //sprawdzenie czy kolor się zmienił zgodnie z założeniami
        cy.get('nb-layout-header nav').should('have.css','background-color', 'rgb(34, 43, 69)')


        // sprawdzenie klikalności i zmiany dla każdego elementu listy

        cy.get('nav nb-select').then( dropdown => {
           cy.wrap(dropdown).click()
           cy.get('.options-list nb-option').each((listItem, index) => {
               const itemText = listItem.text().trim() // pobieram text, przypisujemy do zmiennej i przycinamy, bo ma spację na początku
               const colors ={ // json object z listą nazw kolorów i wartościami
                   "Light": "rgb(255, 255, 255)",
                   "Dark": "rgb(34, 43, 69)",
                   "Cosmic": "rgb(50, 50, 89)",
                   "Corporate": "rgb(255, 255, 255)"
               }
               cy.wrap(listItem).click()//click na elemencie listy
               cy.wrap(dropdown).should('contain', itemText)// sprawdzenie czy text z dorpdownu jest taki sam jak kliknięta opcja 
               cy.get('nb-layout-header nav').should('have.css', 'background-color', colors[itemText]) //sprawdzenie koloru z wykorzystaniem itemText jako klucza dla wartości z jsona
               if ( index < 3){ 
                cy.wrap(dropdown).click()
               }
               
           })
        })
    })
    it('Table - find and edit value', () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains("Smart Table").click()

        cy.get('tbody').contains('tr', 'Larry').then(tableRow => {
            cy.wrap(tableRow).find('.nb-edit').click()
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('25')
            cy.wrap(tableRow).find('.nb-checkmark').click()
            cy.wrap(tableRow).find('td').eq(6).should('contain', '25')

        })
    })
    it('Table - add new value', () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains("Smart Table").click()

        cy.get('thead').find('.nb-plus').click()
        cy.get('thead').find('tr').eq(2).then( tableRow => {
            cy.wrap(tableRow).find('[placeholder="First Name"]').type('Damian')
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type('Szybki')
            cy.wrap(tableRow).find('.nb-checkmark').click()
        })
        // cy.get('tbody').find('tr').eq(0).then( tableRow => {
        //     cy.wrap(tableRow).find('td').eq(2).should('contain', 'Damian')
        cy.get('tbody tr').first().find('td').then( tableColumn => {
            cy.wrap(tableColumn).eq(2).should('contain', 'Damian')
            cy.wrap(tableColumn).eq(3).should('contain', 'Szybki')
        })
        
    })
    it('Table - search value', () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains("Smart Table").click()

        // cy.get('thead [placeholder ="Age"]').type('20')
        // cy.wait(500)
        // cy.get('tbody tr').each(tableRow => {
        //     cy.wrap(tableRow).find('td').eq(6).should('contain', 20)

        const age = [20, 30, 40, 200]
        cy.wrap(age).each( age => {
        cy.get('thead [placeholder ="Age"]').clear().type(age)
        cy.wait(500)
        cy.get('tbody tr').each(tableRow => {
            if(age == 200){
                cy.wrap(tableRow).should('contain', 'No data found')
            } else {
               cy.wrap(tableRow).find('td').eq(6).should('contain', age) 
            }
            
         }) 
        })


    })
    it('Date picker - getting and asserting value', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()

        let date = new Date()
        date.setDate(date.getDate())
        let futureDay = date.getDate()
        let futureMonth = date.toLocaleString('default', {month:'short'})
        let dateAssert = futureMonth+ ' '+ futureDay + ', '+ date.getFullYear()

        cy.contains('nb-card', 'Common Datepicker').find('input').then( input => {
            cy.wrap(input).click()
            selectDayFromCurrent()
            function selectDayFromCurrent(){
                cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then( dateAttribute => {
                    if(!dateAttribute.includes(futureMonth)){
                         cy.get('[data-name="chevron-right"]').click()
                         selectDayFromCurrent()
                   } else {
                       cy.get('nb-calendar-day-picker [class="day-cell ng-star-inserted"]').contains(futureDay).click()
                  }
               })

            }
            
            // cy.get('nb-calendar-day-picker [class="day-cell ng-star-inserted"]').contains(futureDay).click()
            cy.wrap(input).invoke('prop', 'value').should('contain', dateAssert)
        })

    })
    it('PopUps and ToolTips', () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Tooltip').click()
        cy.contains('nb-card', 'Colored Tooltips')
            .contains('Default').click()
        cy.get('nb-tooltip').should('contain', 'This is a tooltip')
    
    })
    it.only('dialog box', () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()
        // popupy natywne przeglądarki
                //1
        cy.get('tbody tr').first().find('.nb-trash').click()
        cy.on('window:confirm', (confirm) => {
            expect(confirm).to.equal('Are you sure you want to delete?')
            //opcja z której lepiej nie korzystać, zaczepia się na evencie
        })
        //2
        const stub = cy.stub()
        cy.on('window:confirm', stub)
        cy.get('tbody tr').first().find('.nb-trash').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
        })
        //3 nie potwierdzanie, wyłączenie dialogu
        cy.get('tbody tr').first().find('.nb-trash').click()
        cy.on('window:confirm', () => false)
        
       
    })

    })