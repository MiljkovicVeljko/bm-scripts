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

window.onload = function () {
  // var variableInstanceId = await getCampaignJobTypeCampaignOffersMessagesVariableInstanceId()
  var ordinalNumber = window.parent.document.dseEditorFrame.dseObjectConfig.dseObject.ordinalNumber
  console.log('ordinalNumber')
  console.log(ordinalNumber)
}