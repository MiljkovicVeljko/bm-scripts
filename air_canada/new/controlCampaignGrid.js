const gridParent = document.querySelector('#variable_type_campaign_offers_messages')
let new_offer_id = null
let new_uuid = null
let isValid = false
let stepNumber = null;

const addRecord = document.querySelectorAll('#variable_type_campaign_offers_messages-targetEl > div > div > div a')[0]
const expendRecord = document.querySelectorAll('#variable_type_campaign_offers_messages-targetEl > div > div > div a')[1]

const myPanel = Ext.create('Ext.panel.Panel', {
  title: 'My Panel',
  renderTo: Ext.getBody(),
  width: Ext.getBody().getWidth(),
  height: Ext.getBody().getHeight(),
  visible: false,
  id: 'spinner_grid',
  layout: 'fit',
  
  // Add a loading mask
  mask: '',
  transparent: true
});

function validateForm(fields) {
  if(fields[0].value !=="" && fields[1].value !=="" && fields[2].value !=="" && fields[3].value !=="" && fields[4].value !=="" && fields[5].querySelectorAll('li').length > 1 && fields[6].value !=="" && fields[7].value !==""){
    isValid = true;
  }
}

function getFieldByAttribute(attribute, fieldType) {
  return document.querySelector(`div[data-test-id="${attribute}"] ${fieldType}`)
}
function getFieldByAttributeExpand(target, attribute, fieldType) {
  return target.querySelector(`div[data-test-id="${attribute}"] ${fieldType}`)
}

expendRecord.onclick = function () {
  setTimeout(() => {
    
    const expendAddRecord = document.querySelector('#maximizeGrid-targetEl > div a')
    const expandGridParent = document.querySelector('#maximizeGrid')
    const expandRows = expandGridParent.querySelectorAll('#maximizeGrid-targetEl table')

    disableExpandedRowIds(expandGridParent, expandRows)
  
    expendAddRecord.onclick = function () {
      new_uuid = uuidv4()
  
      const observer = new MutationObserver(async function () {
        new_offer_id = await generateNewOfferId()
        console.log('new_offer_id----X---->' + new_offer_id)
    
        const saveButton = document.querySelector('#maximizeGrid-targetEl div[role="toolbar"]:last-child a[role="button"]')
        saveButton.textContent = "SAVE/CREATE GUID";

        // mapping all add record form fields
        const offer_id_field = getFieldByAttributeExpand(expandGridParent, 'SingleInputLineColumn - offer_id', 'input')
        const marketing_group_field = getFieldByAttributeExpand(expandGridParent, 'SingleSelectColumn - offer_mktg_group', 'input')
        const advertised_product_field = getFieldByAttributeExpand(expandGridParent, 'SingleSelectColumn - desired_engagement', 'input')
        const desired_engagement_field = getFieldByAttributeExpand(expandGridParent, 'SingleSelectColumn - advertised_product', 'input')
        const travel_journey_field = getFieldByAttributeExpand(expandGridParent, 'SingleSelectColumn - trvl_stage', 'input')
        const message_desc_field = getFieldByAttributeExpand(expandGridParent, 'MultilineInputAreaColumn - offer_msg_desc', 'textarea')
        const language_field = getFieldByAttributeExpand(expandGridParent, 'MultiSelectColumn - language_com', 'ul')
        const offer_start_date_field = getFieldByAttributeExpand(expandGridParent, 'DateInputLineColumn - offer_start_date', 'input')
        const offer_end_date_field = getFieldByAttributeExpand(expandGridParent, 'DateInputLineColumn - offer_end_date', 'input')
        const offer_guid_field = getFieldByAttributeExpand(expandGridParent, 'SingleInputLineColumn - offer_guid', 'input')
        let offerGUIDById = Ext.get(offer_guid_field.id)
    
        const reqFields = [marketing_group_field, advertised_product_field, desired_engagement_field, travel_journey_field, message_desc_field, language_field, offer_start_date_field, offer_end_date_field]

        saveButton.onclick = async function () {
          validateForm(reqFields)
          console.log(isValid);
          if (isValid) {
            console.log("SAVE")
            console.log(new_uuid);
            console.log(offerGUIDById.component.id);
            Ext.getCmp(offerGUIDById.component.id).setValue(new_uuid);
            var customObjects = await getCustomObjectsForCustomStructureWithId(PM_Campaign_Offer_Message_ID_ID)
            var offerIdCustomObject = customObjects.data.filter((obj) => obj.label.default == new_offer_id)
            if (offerIdCustomObject == null || offerIdCustomObject == undefined || offerIdCustomObject.length == 0) {
              var name = new_offer_id.split('-')[0] + "_" + new_offer_id.split('-')[1]
              var state = "EDIT_AND_ADD"
              await createCustomObject(name, new_offer_id, PM_Campaign_Offer_Message_ID_ID, state, null, null, null)
            }
    
            setTimeout(() => {
              getAllDeleteButtons()
            }, 2000);
          }
        }
    
        let offerIDById = Ext.get(offer_id_field.id)
    
        Ext.getCmp(offerIDById.component.id).setValue(new_offer_id)
        Ext.getCmp(offerIDById.component.id).setReadOnly(true)
        Ext.getCmp(offerGUIDById.component.id).setReadOnly(true)
    
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

addRecord.onclick = function () {
  new_uuid = uuidv4()

  const observer = new MutationObserver(async function () {
    new_offer_id = await generateNewOfferId()
    console.log('new_offer_id----X---->' + new_offer_id)

    const panel = document.querySelector('#variable_type_campaign_offers_messages-targetEl > div.x-panel > div')
    const controlButtons = panel.querySelector("div[role='toolbar']:last-child")
    const saveButton = controlButtons?.querySelector("a[role='button']")
    saveButton.textContent = "SAVE/CREATE GUID";

    // mapping all add record form fields
    const offer_id_field = getFieldByAttribute('SingleInputLineColumn - offer_id', 'input')
    const marketing_group_field = getFieldByAttribute('SingleSelectColumn - offer_mktg_group', 'input')
    const advertised_product_field = getFieldByAttribute('SingleSelectColumn - desired_engagement', 'input')
    const desired_engagement_field = getFieldByAttribute('SingleSelectColumn - advertised_product', 'input')
    const travel_journey_field = getFieldByAttribute('SingleSelectColumn - trvl_stage', 'input')
    const message_desc_field = getFieldByAttribute('MultilineInputAreaColumn - offer_msg_desc', 'textarea')
    const language_field = getFieldByAttribute('MultiSelectColumn - language_com', 'ul')
    const offer_start_date_field = getFieldByAttribute('DateInputLineColumn - offer_start_date', 'input')
    const offer_end_date_field = getFieldByAttribute('DateInputLineColumn - offer_end_date', 'input')
    const offer_guid_field = getFieldByAttribute('SingleInputLineColumn - offer_guid', 'input')
    let offerGUIDById = Ext.get(offer_guid_field.id)

    const reqFields = [marketing_group_field, advertised_product_field, desired_engagement_field, travel_journey_field, message_desc_field, language_field, offer_start_date_field, offer_end_date_field]


    saveButton.onclick = async function () {
      validateForm(reqFields)
      console.log(isValid);
      if (isValid) {
        console.log("SAVE")
        console.log(new_uuid);
        console.log(offerGUIDById.component.id);
        Ext.getCmp(offerGUIDById.component.id).setValue(new_uuid);
        var customObjects = await getCustomObjectsForCustomStructureWithId(PM_Campaign_Offer_Message_ID_ID)
        var offerIdCustomObject = customObjects.data.filter((obj) => obj.label.default == new_offer_id)
        if (offerIdCustomObject == null || offerIdCustomObject == undefined || offerIdCustomObject.length == 0) {
          var name = new_offer_id.split('-')[0] + "_" + new_offer_id.split('-')[1]
          var state = "EDIT_AND_ADD"
          await createCustomObject(name, new_offer_id, PM_Campaign_Offer_Message_ID_ID, state, null, null, null)
        }

        setTimeout(() => {
          getAllDeleteButtons()
        }, 2000);
      }
    }

    let offerIDById = Ext.get(offer_id_field.id)

    Ext.getCmp(offerIDById.component.id).setValue(new_offer_id)
    Ext.getCmp(offerIDById.component.id).setReadOnly(true)
    Ext.getCmp(offerGUIDById.component.id).setReadOnly(true)

    observer.disconnect()
  })

  const config = {
    childList: true,
    childNodes: true,
    attributes: true,
    subtree: true
  }

  observer.observe(gridParent, config)
}


window.onload = async function () {
  new_offer_id = await generateNewOfferId()
  console.log('new_offer_id-------->' + new_offer_id)

  stepNumber = window.dseObjectConfig.stepNumber;
  console.log(stepNumber);

  const gridParentMsg = document.querySelector('#variable_type_campaign_offers_messages')
  const gridRows = document.querySelectorAll('#variable_type_campaign_offers_messages-targetEl div[role="grid"] table')

  disableExpandedRowIds(gridParentMsg, gridRows)

  myPanel.setVisible(false)
  getAllDeleteButtons()
}

function disableExpandedRowIds(parentGrid, rows) {
  rows.forEach(row => {
    row.querySelector('td > div > div').onclick = function() {
      const observerExpand = new MutationObserver(async function() {
        const allRowFields = row.querySelectorAll('td.x-grid-td.x-grid-cell-rowbody > div > div > div > div > div > div > div')

        allRowFields[0].style.pointerEvents = 'none'
        allRowFields[allRowFields.length - 1].style.pointerEvents = 'none'
  
        observerExpand.disconnect();
      })

      const config = {
        childList: true,
        childNodes: true,
        attributes: true,
        subtree: true
      }
      observerExpand.observe(parentGrid, config)
    }
  })
}

async function isContainedInChildActivitiy(offer_id) {
  var variableInstanceId = await getActivityJobTypeVersioningAndDeploymentVariableInstanceId()
  console.log('variableInstanceId');
  console.log(variableInstanceId);
  var instanceId = window.parent.document.dseEditorFrame.dseObjectConfig.dseObject.instanceId
  var l10nLocaleId = 0
  var mySubActivities = await getSubJobs(instanceId, l10nLocaleId)
  for(let i = 0; i < mySubActivities.items.length; i++) {
    if(mySubActivities.items[i].typeName !== 'Activity')
      continue;
    var subJobOrdinalNumber = mySubActivities.items[i].formattedId
    var activityVersionAndDeploymentGrid = await getActivityVersionAndDeploymentGrid(subJobOrdinalNumber, variableInstanceId)
    console.log('activityVersionAndDeploymentGrid');
    console.log(activityVersionAndDeploymentGrid);
    var isContained = false;
    activityVersionAndDeploymentGrid.forEach(actGridRow=>{
      var versions = JSON.parse(actGridRow.values.enversion_offersmessages)
      isContained = versions.find(v=>{
        var str = v.replace(/_([^_]*)$/, '-' + '$1')
        console.log(str)
        console.log(offer_id)
        return str == offer_id
      }) != undefined
    })
  }
  
  return isContained
}

var deleteButtons
const getAllDeleteButtons = async () => {
  deleteButtons = document.querySelectorAll("a[data-qtip='Delete']")
  var campaignOffersMessagesGridRows = await getCampaignOffersMessagesGridRows()
  campaignOffersMessagesGridRows = sortGridDataDescByOfferId(campaignOffersMessagesGridRows)
  console.log(campaignOffersMessagesGridRows)
  console.log(customObjects.data)

  myPanel.setVisible(false)
  myPanel.setLoading(false);

  for (let i = 0; i < deleteButtons.length; i++) {
    const oldFunction = deleteButtons[i].onclick
    deleteButtons[i].onclick = async function () {
      console.log("Delete")
      
      myPanel.setVisible(true)
      myPanel.setLoading(true);

      let getIdOfRow = deleteButtons[i].parentElement.parentElement.parentElement.querySelectorAll('td')[1].querySelector('span').textContent
      console.log(getIdOfRow);

      customObjects = await getCustomObjectsForCustomStructureWithId(PM_Campaign_Offer_Message_ID_ID)
      var customObjectToBeDeleted = customObjects.data.find((obj) => obj.label.default == getIdOfRow)

      if(await isContainedInChildActivitiy(getIdOfRow)) {
        myPanel.setVisible(false)
        myPanel.setLoading(false);
        alert("Offer/Message has been selected in an Activity and cannot be deleted")
      } else {
        console.log('customObjectToBeDeleted', customObjectToBeDeleted);
        var deleteResponse = null;
        // var deleteResponse = await deleteCustomObjectWithId(customObjectToBeDeleted != undefined ? customObjectToBeDeleted.id : -1)

        if (customObjectToBeDeleted) {
          deleteResponse = await deleteCustomObjectWithId(customObjectToBeDeleted.id)
        }

        console.log(deleteResponse);
        if (deleteResponse != null)
          oldFunction()
      }
      setTimeout(() => {
        getAllDeleteButtons()
      }, 2000);
    }
  }
}

function disableDeleteButtons(deleteButtons) {
  for (let i = 0; i < deleteButtons.length; i++)
    deleteButtons[i].style.pointerEvents='none'
}

function enableDeleteButtons(deleteButtons) {
  for (let i = 0; i < deleteButtons.length; i++)
    deleteButtons[i].style.pointerEvents='auto'
}
//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// API CALLS AND OFFER ID AND UUID GENERATORS  ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

var API_AUTH = { access_token: null }
var PM_Campaign_Offer_Message_ID_ID = 573
var DO_CREATE_CUSTOM_OBJECT_FOR_PM_OFFER_MESSAGE_ID = false
var customObjects

var newCustomObjectDto = {
  "name": null,
  "label": {
    "default": null
  },
  "customStructureId": PM_Campaign_Offer_Message_ID_ID,
  "state": "EDIT_AND_ADD",
  "parentId": null,
  "affiliate": null,
  "attributeValues": null
}

async function generateNewOfferId() {
  var ordinalNumber = window.parent.document.dseEditorFrame.dseObjectConfig.dseObject.ordinalNumber
  // var campaignOffersMessagesGridRows = await getCampaignOffersMessagesGridRows();
  // console.log('campaignOffersMessagesGridRows');
  // console.log(campaignOffersMessagesGridRows);
  // console.log('campaignOffersMessagesGridRows length');
  // console.log(campaignOffersMessagesGridRows.length);
  // var offer_id = ordinalNumber + '-' + (campaignOffersMessagesGridRows.length + 1)
  customObjects = await getCustomObjectsForCustomStructureWithId(PM_Campaign_Offer_Message_ID_ID)
  var sortedObjectsByOfferID = sortDataAscByOfferId(customObjects.data)
  sortedObjectsByOfferID = sortedObjectsByOfferID.filter((so) =>
    so.name.substring(0, so.name.lastIndexOf('_')) == ordinalNumber + ''
  )
  var lastOfferObject
  if (sortedObjectsByOfferID.length > 0)
    lastOfferObject = sortedObjectsByOfferID[sortedObjectsByOfferID.length - 1]
  else
    return ordinalNumber + '-' + 1

  var lastOfferID = lastOfferObject.name.substring(lastOfferObject.name.lastIndexOf('_') + 1)
  var offer_id = ordinalNumber + '-' + (parseInt(lastOfferID) + 1)

  return offer_id
}

function sortDataAscByOfferId(data) {
  return data.sort(function (a, b) {
    var offerId1 = a.name.toUpperCase()
    var offerId2 = b.name.toUpperCase()
    return (offerId1 < offerId2) ? -1 : (offerId1 > offerId2) ? 1 : 0
  })
}

function sortGridDataDescByOfferId(gridData) {
  return gridData.sort(function (a, b) {
    var offerId1 = a.rowInstanceId
    var offerId2 = b.rowInstanceId
    return (offerId1 > offerId2) ? -1 : (offerId1 < offerId2) ? 1 : 0
  })
}

async function getCampaignOffersMessagesGridRows() {
  API_AUTH = await getApiBearerToken()
  var ordinalNumber = window.parent.document.dseEditorFrame.dseObjectConfig.dseObject.ordinalNumber
  var variableInstanceId = await getCampaignJobTypeCampaignOffersMessagesVariableInstanceId()

  var campaignOffersMessagesGridRows = await getGridRows(ordinalNumber, variableInstanceId)
  console.log(campaignOffersMessagesGridRows)
  return campaignOffersMessagesGridRows
}

//  AUTH
const getApiBearerToken = async () => {
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

async function getCampaignJobTypeCampaignOffersMessagesVariableInstanceId() {
  API_AUTH = await getApiBearerToken()
  var campaignJobTypeId = await getCampaignJobTypeId()
  var campaignJobType = await getJobTypeWithVariables(campaignJobTypeId)
  return campaignJobType.variables.filter((variable) => { return variable.technicalName == "campaign_offers_messages" })[0].id
}

async function getCampaignJobTypeId() {
  API_AUTH = await getApiBearerToken()
  var jobTypes = await getAllJobTypes()
  return jobTypes.filter((jt) => { return jt.displayName == "Campaign" })[0].id
}

async function getActivityJobTypeVersioningAndDeploymentVariableInstanceId() {
  API_AUTH = await getApiBearerToken()
  var campaignJobTypeId = await getActivityJobTypeId()
  var campaignJobType = await getJobTypeWithVariables(campaignJobTypeId)
  return campaignJobType.variables.filter((variable) => { return variable.technicalName == "versioning_and_deployment" })[0].id
}

async function getActivityJobTypeId() {
  API_AUTH = await getApiBearerToken()
  var jobTypes = await getAllJobTypes()
  return jobTypes.filter((jt) => { return jt.displayName == "Activity" })[0].id
}

//  DELETE CUSTOM OBJECT WITH ID ID
async function deleteCustomObjectWithId(customObjectId) {
  var deleteCustomObjectWithIdUrl = `/data-structures/rest/custom-object/${customObjectId}`
  console.log('deleteCustomObjectWithId customObjectId')
  console.log(customObjectId)
  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()

    xhr.open("DELETE", deleteCustomObjectWithIdUrl)
    xhr.withCredentials = true
    xhr.setRequestHeader("Authorization", "Bearer " + API_AUTH.access_token)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send()

    xhr.addEventListener("readystatechange", function () {
      console.log('DELETE this.status')
      console.log(this.status)
      if (this.readyState === 4 && this.status === 204) {
        console.log(this.responseText);
        return resolve(this.responseText)
      } else {
        console.log("RETURN NULL DELETE STATUS")
        return null
      }
    })
  })
}

//  createCustomObject
async function createCustomObject(name,
  defaultLabel,
  customStructureId,
  state,
  parentId,
  affiliate,
  attributeValues) {
  var jobTypesUrl = `/data-structures/rest/custom-object`
  newCustomObjectDto.name = name
  newCustomObjectDto.label.default = defaultLabel
  newCustomObjectDto.customStructureId = customStructureId
  newCustomObjectDto.state = state
  newCustomObjectDto.parentId = parentId
  newCustomObjectDto.affiliate = affiliate
  newCustomObjectDto.attributeValues = attributeValues

  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()
    xhr.withCredentials = true

    xhr.open("POST", jobTypesUrl)
    xhr.setRequestHeader("Authorization", "Bearer " + API_AUTH.access_token)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify(newCustomObjectDto))

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

//  GET CUSTOM OBJECTS
async function getCustomObjectsForCustomStructureWithId(customStructureId) {
  var allCustomObjectsForCustomStructureUrl = `/data-structures/rest/custom-object?customStructureId=${customStructureId}`

  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()

    xhr.open("GET", allCustomObjectsForCustomStructureUrl)
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

//  GET CUSTOM STRUCTURES
async function getAllCustomStructures() {
  var allCustomStructuresUrl = `/data-structures/rest/custom-structure`

  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()

    xhr.open("GET", allCustomStructuresUrl)
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

//  GET Subjobs
async function getSubJobs(instanceId, l10nLocaleId) {
  var subJobsUrl = `/dse/rest/ui/objects/${instanceId}/${l10nLocaleId}/subjobs`

  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()

    xhr.open("GET", subJobsUrl)
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

//  GET Version Deployment Grid
async function getActivityVersionAndDeploymentGrid(ordinalNumber, variableInstanceId) {
  var activityVersionAndDeploymentGridUrl = `/dse/rest/internal/jobs/${ordinalNumber}/grids/${variableInstanceId}/rows`

  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()

    xhr.open("GET", activityVersionAndDeploymentGridUrl)
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

//  UUID V4
async function getUuidV4() {
  var uuidUrl = `https://www.uuidtools.com/api/generate/v4`
  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()

    xhr.open("GET", uuidUrl)
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


function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// API CALLS AND OFFER ID AND UUID GENERATORS  ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////