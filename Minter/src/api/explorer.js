const baseURL = "https://explorer-api.minter.network/api/v1/"

// It all can be simplified with naive approach while using things that are
// not guaranteed by specification. Choose your poison.

// With naive approach one could just add page number to this request
// But "page" parameter is unspecified in official API docs
export function getDelegations(address) {
  return fetch(baseURL + `addresses/${address}/delegations`)
    .then(resp => resp.json())
    .catch(log)
}

// Due to lack of specification in official API:
// 1. Maximum amount of delegations per list is not specified
// 2. Request parameters are not specified
//
// It was chosen that hidden "limit" parameter wont be used but instead
// recursive approach was chosen to request all delegations
// according to included "next" and "total" fields with API urls as values
export function getAllDelegations(address) {
  const delegations = []

  const requestNext = (json) => {
    delegations.push(...json.data)

    if (!json.links.next) return

    fetch("https://" + json.links.next)
      .then(resp => resp.json())
      .then(requestNext)
      .catch(log)
  }

  getDelegations(address).then(json => requestNext(json))

  return delegations
}

function log(err) {
  console.error("[API Explorer] Request failed\n", err)
}
