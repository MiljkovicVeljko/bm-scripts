var API_AUTH = { access_token: null }
let addRecord;
let expandRecord;
let campaignJobID = null;
const gridParent = document.querySelector('#variable_type_versioning_and_deployment')
const grid = document.querySelector('#variable_type_campaign_offer_message-targetEl > div.x-grid')
let stepNumber = null;

window.onload = async function () {
  console.log("COPY CAMPAIGN GRID LOADED")
  stepNumber = window.dseObjectConfig.stepNumber;
  console.log(stepNumber);
  hideDeleteButtons()

  document.querySelector('#variable_type_campaign_offer_message-targetEl > div').style.display = 'none'
  disableExpandedRowIds('variable_type_versioning_and_deployment')

  var variableInstanceId = await getActivityJobTypeCampaignOffersMessagesVariableInstanceId()
  // DELETE old grid
  await deleteOfferMessageRowsInActivity(variableInstanceId)

  // CREATE new grid
  const rows = await getCampaignOffersMessagesGridRows()
  campaignJobID = rows[0].values.offer_id.split('-')[0]
  rows.forEach(row => copyRowsInActivity(variableInstanceId, row.values))

  // Refresh Grid
  setTimeout(() => {
    const gridExt = Ext.getCmp(Ext.get(grid.id).component.id)
    const store = gridExt.getStore()
    store.load()
    hideDeleteButtons()
    // gridExt.getView().refresh()

    store.on('load', function () {
      hideDeleteButtons()
      // observer
      disableExpandedRowIds('variable_type_campaign_offer_message')  
    })

    // set expand form readOnly for each table row
    console.log("TIMED OUT");
  }, 1000);
  
  if(stepNumber >= 3){
    addRecord = document.querySelectorAll('#variable_type_versioning_and_deployment-targetEl > div > div > div a')[0]
    expandRecord = document.querySelectorAll('#variable_type_versioning_and_deployment-targetEl > div > div > div a')[1]

    //OBSERVER Expand Record
    expandRecord.onclick = function () {
      console.log("Expand table clicked.");
      setTimeout(() => {

        const expendAddRecord = document.querySelector('#maximizeGrid-targetEl > div a')
        const expandGridParent = document.querySelector('#maximizeGrid')

        disableExpandedRowIds('maximizeGrid')
        expendAddRecord.onclick = function () {
          new_uuid = uuidv4()

          const observer = new MutationObserver(async function () {

            const saveButton = document.querySelector('#maximizeGrid-targetEl div[role="toolbar"]:last-child a[role="button"]')
            saveButton.textContent = "SAVE/CREATE GUID";

            const deploymentGuid = getFieldByAttributeExpand(expandGridParent,"SingleInputLineColumn - endeployment_guid", "input")
            let deploymentGuidById = Ext.get(deploymentGuid.id);
            Ext.getCmp(deploymentGuidById.component.id).setReadOnly(true)

            saveButton.onclick = async function () {
              Ext.getCmp(deploymentGuidById.component.id).setValue(new_uuid);
            }

            observer.disconnect()
          })

          const config = {
            childList: true,
            childNodes: true,
            attributes: true,
            subtree: true
          }

          observer.observe(expandGridParent, config)
        }
      }, 1000);
    }


    //OBSERVER
    addRecord.onclick = function () {
      console.log("Add record clicked.");
      new_uuid = uuidv4()

      const observer2 = new MutationObserver(async function () {
        const panel = document.querySelector('#variable_type_versioning_and_deployment-targetEl > div.x-panel > div')
        const controlButtons = panel.querySelector("div[role='toolbar']:last-child")
        const saveButton = controlButtons.querySelector("a[role='button']")
        saveButton.textContent = "SAVE/CREATE GUID";

        const versionOfferInput = getFieldByAttribute("MultiSelectColumn - enversion_offersmessages", "input")
        const versionOffer2 = document.querySelector(`div[data-test-id="MultiSelectColumn - enversion_offersmessages"]`)
        const deploymentGuid = getFieldByAttribute("SingleInputLineColumn - endeployment_guid", "input")
        let deploymentGuidById = Ext.get(deploymentGuid.id);
        Ext.getCmp(deploymentGuidById.component.id).setReadOnly(true)

        saveButton.onclick = function (){
          console.log("SAVE");
          Ext.getCmp(deploymentGuidById.component.id).setValue(new_uuid);
        }

        versionOffer2.onclick = function () {
          const extVersionOffer = Ext.get(versionOfferInput.id)
          const store = Ext.getCmp(extVersionOffer.component.id).getStore()

          store.filter('value', campaignJobID);
        }
        observer2.disconnect();
      })


      const config = {
        childList: true,
        childNodes: true,
        attributes: true,
        subtree: true
      }

      observer2.observe(gridParent, config)
    }
  }
}

function disableExpandedRowIds(parentGridId) {  
  const gridParentMsg = document.querySelector(`#${parentGridId}`)
  const gridRows = document.querySelectorAll(`#${parentGridId}-targetEl table`)

  gridRows.forEach(row => {
    row.querySelector('td > div > div').onclick = function() {
      const observerExpand = new MutationObserver(async function() {
        const allRowFields = row.querySelectorAll('td.x-grid-td.x-grid-cell-rowbody > div > div > div > div > div > div > div')

        if (parentGridId === 'variable_type_campaign_offer_message') {
          allRowFields[0].style.pointerEvents = 'none'
        }
        allRowFields[allRowFields.length - 1].style.pointerEvents = 'none'
  
        observerExpand.disconnect();
      })

      const config = {
        childList: true,
        childNodes: true,
        attributes: true,
        subtree: true
      }
      observerExpand.observe(gridParentMsg, config)
    }
  })
}

function getFieldByAttribute(attribute, fieldType) {
  return document.querySelector(`div[data-test-id="${attribute}"] ${fieldType}`)
}

function getFieldByAttributeExpand(target, attribute, fieldType) {
  return target.querySelector(`div[data-test-id="${attribute}"] ${fieldType}`)
}


function hideDeleteButtons() {
  document.querySelectorAll("#variable_type_campaign_offer_message-targetEl a[data-qtip='Delete']").forEach(button => button.style.display = 'none')
}

async function getCampaignOffersMessagesGridRows() {
  API_AUTH = await getApiBearerToken()
  var ordinalNumber = await parentOrdinalNumber()
  var variableInstanceId = await getCampaignJobTypeCampaignOffersMessagesVariableInstanceId()

  var campaignOffersMessagesGridRows = await getGridRows(ordinalNumber, variableInstanceId)
  console.log(campaignOffersMessagesGridRows)
  return campaignOffersMessagesGridRows
}

async function getCampaignJobTypeCampaignOffersMessagesVariableInstanceId() {
  API_AUTH = await getApiBearerToken()
  var campaignJobTypeId = await getCampaignJobTypeId()
  var campaignJobType = await getJobTypeWithVariables(campaignJobTypeId)
  return campaignJobType.variables.filter((variable) => { return variable.technicalName == "campaign_offers_messages" })[0].id
}

async function getActivityJobTypeCampaignOffersMessagesVariableInstanceId() {
  API_AUTH = await getApiBearerToken()
  var campaignJobTypeId = await getActivityJobTypeId()
  var campaignJobType = await getJobTypeWithVariables(campaignJobTypeId)
  return campaignJobType.variables.filter((variable) => { return variable.technicalName == "campaign_offer_message" })[0].id
}

async function getCampaignJobTypeId() {
  API_AUTH = await getApiBearerToken()
  var jobTypes = await getAllJobTypes()
  return jobTypes.filter((jt) => { return jt.displayName == "Campaign" })[0].id
}

async function getActivityJobTypeId() {
  API_AUTH = await getApiBearerToken()
  var jobTypes = await getAllJobTypes()
  return jobTypes.filter((jt) => { return jt.displayName == "Activity" })[0].id
}


function myOrdinalNumber() {
  return window.parent.document.dseEditorFrame.dseObjectConfig.dseObject.ordinalNumber
}


async function parentOrdinalNumber() {
  API_AUTH = await getApiBearerToken()
  var parentInstanceId = window.parent.document.dseEditorFrame.dseObjectConfig.dseObject.parentId
  var l10nLocaleId = 0
  var parentDseObj = await getDseObject(parentInstanceId, l10nLocaleId)
  return parentDseObj.ordinalNumber
}

////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////  API CALLS    ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


async function deleteOfferMessageRowsInActivity(variableInstanceId) {
  var ordinalNumber = window.parent.document.dseEditorFrame.dseObjectConfig.dseObject.ordinalNumber
  const activityGridUrl = `/dse/rest/internal/jobs/${ordinalNumber}/grids/${variableInstanceId}/rows/_truncate`

  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()
    xhr.withCredentials = true

    xhr.open("DELETE", activityGridUrl)
    xhr.setRequestHeader("Authorization", "Bearer " + API_AUTH.access_token)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send()
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        return resolve(JSON.parse(this.responseText))
      } else {
        return null
      }
    })
  })
}

async function copyRowsInActivity(variableInstanceId, rowObj) {
  // https://aircanada-dev.brandmakerinc.com/dse/rest/internal/jobs/instanceId3173/grids/variableInstance4778/rows
  var ordinalNumber = window.parent.document.dseEditorFrame.dseObjectConfig.dseObject.ordinalNumber
  const activityGridUrl = `/dse/rest/internal/jobs/${ordinalNumber}/grids/${variableInstanceId}/rows`

  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()
    xhr.withCredentials = true

    xhr.open("POST", activityGridUrl)
    xhr.setRequestHeader("Authorization", "Bearer " + API_AUTH.access_token)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify(formatRows(rowObj)))

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        return resolve(JSON.parse(this.responseText))
      } else {
        return null
      }
    })
  })
}

function formatRows(rows) {
  const filteredObj = Object.fromEntries(
    Object.entries(rows).filter(([key, value]) => value !== 'null' && value.length !== 0 && value !== '[]')
  )


  for (const key in filteredObj) {
    filteredObj[key] = `\"${filteredObj[key]}\"`
  }

  return filteredObj
}

async function getDseObject(instanceId, l10nLocaleId) {
  var dseObjectUrl = `/dse/rest/v1.0/dse-object/${instanceId}/${l10nLocaleId}`

  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()
    xhr.withCredentials = true

    xhr.open("GET", dseObjectUrl)
    xhr.setRequestHeader("Authorization", "Bearer " + API_AUTH.access_token)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send()

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        return resolve(JSON.parse(this.responseText))
      } else {
        return null
      }
    })
  })
}

//  JOB TYPE WITH VARIABLES FOR JOB WITH ID
async function getGridRows(ordinalNumber, variableInstanceId) {
  var gridRowsUrl = `/dse/rest/v1.0/jobs/${ordinalNumber}/grids/${variableInstanceId}/rows`
  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()

    xhr.open("GET", gridRowsUrl)
    xhr.withCredentials = true
    xhr.setRequestHeader("Authorization", "Bearer " + API_AUTH.access_token)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send()

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        return resolve(JSON.parse(this.responseText))
      } else {
        return null
      }
    })
  })
}

//  JOB TYPE WITH VARIABLES FOR JOB WITH ID
async function getJobTypeWithVariables(jobTypeId) {
  var jobTypeWithVariablesUrl = `/dse/rest/v1.0/admin/object-types/${jobTypeId}`

  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()

    xhr.open("GET", jobTypeWithVariablesUrl)
    xhr.withCredentials = true
    xhr.setRequestHeader("Authorization", "Bearer " + API_AUTH.access_token)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send()

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        return resolve(JSON.parse(this.responseText))
      } else {
        return null
      }
    })
  })
}

//  JOB TYPE WITH VARIABLES FOR JOB WITH ID
async function getJobTypeWithVariables(jobTypeId) {
  var jobTypeWithVariablesUrl = `/dse/rest/v1.0/admin/object-types/${jobTypeId}`

  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()

    xhr.open("GET", jobTypeWithVariablesUrl)
    xhr.withCredentials = true
    xhr.setRequestHeader("Authorization", "Bearer " + API_AUTH.access_token)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send()

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        return resolve(JSON.parse(this.responseText))
      } else {
        return null
      }
    })
  })
}

//  ALL JOB TYPES
async function getAllJobTypes() {
  var jobTypesUrl = `/dse/rest/v1.0/admin/object-types`

  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()
    xhr.withCredentials = true

    xhr.open("GET", jobTypesUrl)
    xhr.setRequestHeader("Authorization", "Bearer " + API_AUTH.access_token)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send()

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        return resolve(JSON.parse(this.responseText))
      } else {
        return null
      }
    })
  })
}


//  AUTH
async function getApiBearerToken () {
  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()
    xhr.withCredentials = true

    xhr.open("GET", "/rest/sso/auth/jaas/jwt")
    xhr.send()

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        return resolve(JSON.parse(this.responseText))
      }
    })
  })
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}