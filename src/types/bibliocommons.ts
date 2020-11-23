/**
 * Represents a book in the catalog.
 */
export type Book = {
  title: string;
  author: string;
  description: string;
  call_number: string;
  cover_image: string | null;
  full_record_link: string | null;
};

export type BookDescription = {
  isbn: string | null;
  title: string;
  author: string;
};

export type Branch = {
  label: string;
  name: string;
};

export type Library = {
  // The library's homepage is accessed at https://{subdomain}.bibliocommons.com/search
  // (This doubles as a unique identifier)
  subdomain: string;

  // The human-readable name of this library system
  name: string;

  // Each BiblioCommons library system has a number of "branches" in its system.
  // These represent physical library locations that are under the same network.
  // We could identify these via API queries, but they change so rarely that we can hardcode them.
  //
  // To get a list, go to: https://{subdomain}.bibliocommons.com/search
  branches: Branch[];
};

export const SFPL: Library = {
  subdomain: "sfpl",
  name: "San Francisco Public Library",
  branches: [
    // These are just the branches that are no longer marked "CLOSED"
    // They retain their old branch names, but now with an asterisk
    { name: "*MAIN", label: "Main Library" },
    { name: "*ANZA BRANCH", label: "Anza" },
    { name: "*CHINATOWN BRANCH", label: "Chinatown" },
    { name: "*EUREKA VALLEY BRANCH", label: "Eureka Valley" },
    { name: "*EXCELSIOR BRANCH", label: "Excelsior" },
    { name: "*MARINA BRANCH", label: "Marina" },
    { name: "*MERCED BRANCH", label: "Merced" },
    { name: "*MISSION BAY BRANCH", label: "Mission Bay" },
    { name: "*ORTEGA BRANCH", label: "Ortega" },
    { name: "*VISITACION VALLEY BRANCH", label: "Visitacion Valley" }
    // Other options:
    // Acquisition
    // CHILDREN'S BOOKMOBILE
    // CLOSED-BAYVIEW BRANCH
    // CLOSED-BERNAL HEIGHTS BRANCH
    // CLOSED-GLEN PARK BRANCH
    // CLOSED-GOLDEN GATE VALLEY BRANCH
    // CLOSED-INGLESIDE BRANCH
    // CLOSED-MISSION
    // CLOSED-NOE VALLEY BRANCH
    // CLOSED-NORTH BEACH BRANCH
    // CLOSED-OCEAN VIEW BRANCH
    // CLOSED-PARK BRANCH
    // CLOSED-PARKSIDE BRANCH
    // CLOSED-PORTOLA BRANCH
    // CLOSED-POTRERO BRANCH
    // CLOSED-PRESIDIO BRANCH
    // CLOSED-RICHMOND BRANCH
    // CLOSED-SUNSET BRANCH
    // CLOSED-WEST PORTAL BRANCH
    // CLOSED-WESTERN ADDITION BRANCH
    // PUBLIC KNOWLEDGE BRANCH (SFMOMA)
  ]
};

export const SUPPORTED_LIBRARIES: Library[] = [
  {
    subdomain: "aclibrary",
    name: "Alameda County Library",
    branches: [
      "24/7 Library",
      "Acquisition",
      "Albany",
      "Castro Valley",
      "Centerville",
      "Dublin",
      "Fremont",
      "Irvington",
      "Newark",
      "Niles",
      "None",
      "San Lorenzo",
      "Union City"
    ].map(name => ({ name: name, label: name }))
  },
  SFPL,
  {
    subdomain: "seattle",
    name: "Seattle Public Library",
    branches: [
      "Ballard Branch",
      "Beacon Hill Branch",
      "Broadview Branch",
      "Capitol Hill Branch",
      "Central Library",
      "Columbia Branch",
      "Delridge Branch",
      "Douglass-Truth Branch",
      "Fremont Branch",
      "Green Lake Branch",
      "Greenwood Branch",
      "High Point Branch",
      "International District/Chinatown Branch",
      "Madrona-Sally Goldmark Branch",
      "Magnolia Branch",
      "Mobile Services",
      "Montlake Branch",
      "NewHolly Branch",
      "Northeast Branch",
      "Northgate Branch",
      "Queen Anne Branch",
      "Rainier Beach Branch",
      "South Park Branch",
      "Southwest Branch",
      "University Branch",
      "Wallingford Branch",
      "West Seattle Branch"
    ].map(name => ({ name: name, label: name }))
  }
];
