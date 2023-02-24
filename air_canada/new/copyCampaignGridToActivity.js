var API_AUTH = { access_token: null }

window.onload = async function () {
  console.log("COPY CAMPAIGN GRID LOADED")
  var variableInstanceId = await getActivityJobTypeCampaignOffersMessagesVariableInstanceId()
  // DELETE old grid
  const deleteRes = await deleteOfferMessageRowsInActivity(variableInstanceId)
  console.log(deleteRes);

  const rows = await getCampaignOffersMessagesGridRows()
  
  // CREATE new grid
  for (let index = 0; index < rows.length; index++) {
    copyRowsInActivity(variableInstanceId, rows[i].values)
  }
  // rows.forEach(row => copyRowsInActivity(variableInstanceId, row.values))
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
);


for (const key in filteredObj) {
  filteredObj[key] = `\"${filteredObj[key]}\"`
}

 return filteredObj;
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
