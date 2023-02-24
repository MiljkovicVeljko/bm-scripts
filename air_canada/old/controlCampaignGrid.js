console.log("radim!");
// const elements = document.querySelectorAll('#variable_type_campaign_offers_messages input');
let isActive = false;

// const selectFirst = elements[0]
// const selectLast = elements[elements.length - 1]

// const findElementByUniqueName2 = uniqueName => {
//   return Ext.ComponentQuery.query('*[itemId=' + uniqueName + ']')[0]
// }

const el = document.querySelector("#variable_type_campaign_offers_messages div[id$='-innerCt']")
// el.addEventListener("click", function() {
//   console.log("btn clicked!");
//   isActive = true;
// })
el.onclick = function() {
  console.log("btn clicked!");
  isActive = true;

}

window.onload = async function () {
  var new_offer_id = await generateNewOfferId()
  console.log('new_offer_id-------->' + new_offer_id)
  var new_uuid = uuidv4()
  console.log('new_uuid------------>' + new_uuid)
}

//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// API CALLS AND OFFER ID AND UUID GENERATORS  ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

var API_AUTH = {access_token: null};

async function generateNewOfferId() {
  var ordinalNumber = window.parent.document.dseEditorFrame.dseObjectConfig.dseObject.ordinalNumber
  var campaignOffersMessagesGridRows = await getCampaignOffersMessagesGridRows();
  console.log('campaignOffersMessagesGridRows');
  console.log(campaignOffersMessagesGridRows);
  console.log('campaignOffersMessagesGridRows length');
  console.log(campaignOffersMessagesGridRows.length);
  var offer_id = ordinalNumber + '-' + (campaignOffersMessagesGridRows.length + 1)
  return offer_id
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
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.open("GET", "/rest/sso/auth/jaas/jwt");
      xhr.send();

      xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
              return resolve(JSON.parse(this.responseText));
          }
      });
  });
};

async function getCampaignJobTypeCampaignOffersMessagesVariableInstanceId() {
  API_AUTH = await getApiBearerToken()
  var campaignJobTypeId = await getCampaignJobTypeId()
  var campaignJobType = await getJobTypeWithVariables(campaignJobTypeId)
  return campaignJobType.variables.filter((variable) => {return variable.technicalName == "campaign_offers_messages"})[0].id;
}

async function getCampaignJobTypeId() {
  API_AUTH = await getApiBearerToken()
  var jobTypes = await getAllJobTypes();
  return jobTypes.filter((jt) => {return jt.displayName == "Campaign"})[0].id;
}


//  ALL JOB TYPES
async function getAllJobTypes() {
  var jobTypesUrl = `/dse/rest/v1.0/admin/object-types`;
  
  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open("GET", jobTypesUrl);
    xhr.setRequestHeader("Authorization", "Bearer " + API_AUTH.access_token);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();

    xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                return resolve(JSON.parse(this.responseText));
            } else {
                return null;
            }
        });
    });
}

//  JOB TYPE WITH VARIABLES FOR JOB WITH ID
async function getJobTypeWithVariables(jobTypeId) {
  var jobTypeWithVariablesUrl = `/dse/rest/v1.0/admin/object-types/${jobTypeId}`;

  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", jobTypeWithVariablesUrl);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Authorization", "Bearer " + API_AUTH.access_token);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();

    xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                return resolve(JSON.parse(this.responseText));
            } else {
                return null;
            }
        });
    });
}

//  JOB TYPE WITH VARIABLES FOR JOB WITH ID
async function getGridRows(ordinalNumber, variableInstanceId) {
  var gridRowsUrl = `/dse/rest/v1.0/jobs/${ordinalNumber}/grids/${variableInstanceId}/rows`;
  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", gridRowsUrl);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Authorization", "Bearer " + API_AUTH.access_token);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();

    xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                return resolve(JSON.parse(this.responseText));
            } else {
                return null;
            }
        });
    });
}

//  UUID V4
async function getUuidV4() {
    var uuidUrl = `https://www.uuidtools.com/api/generate/v4`;
    return new Promise(function (resolve) {
      var xhr = new XMLHttpRequest();
  
      xhr.open("GET", uuidUrl);
      xhr.send();
  
      xhr.addEventListener("readystatechange", function () {
              if (this.readyState === 4) {
                  return resolve(JSON.parse(this.responseText));
              } else {
                  return null;
              }
          });
      });
}


function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// API CALLS AND OFFER ID AND UUID GENERATORS  ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////