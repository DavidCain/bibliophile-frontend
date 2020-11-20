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
    { name: "MAIN", label: "Main Library" },
    { name: "ANZA BRANCH", label: "Anza" },
    { name: "BAYVIEW BRANCH", label: "Bayview" },
    { name: "BERNAL HEIGHTS BRANCH", label: "Bernal Heights" },
    { name: "CHILDREN'S BOOKMOBILE", label: "Children's Bookmobile" },
    { name: "CHINATOWN BRANCH", label: "Chinatown" },
    { name: "EUREKA VALLEY BRANCH", label: "Eureka Valley" },
    { name: "EXCELSIOR BRANCH", label: "Excelsior" },
    { name: "GLEN PARK BRANCH", label: "Glen Park" },
    {
      name: "GOLDEN GATE VALLEY BRANCH",
      label: "Golden Gate Valley"
    },
    { name: "INGLESIDE BRANCH", label: "Ingleside" },
    { name: "LIBRARY FOR THE BLIND", label: "Library for the Blind" },
    { name: "MARINA BRANCH", label: "Marina" },
    { name: "MERCED BRANCH", label: "Merced" },
    { name: "MISSION", label: "Mission" },
    { name: "MISSION BAY BRANCH", label: "Mission Bay" },
    { name: "NOE VALLEY", label: "Noe Valley" },
    { name: "NORTH BEACH BRANCH", label: "North Beach" },
    { name: "OCEAN VIEW BRANCH", label: "Ocean View" },
    { name: "ORTEGA BRANCH", label: "Ortega" },
    { name: "PARK BRANCH", label: "Park" },
    { name: "PARKSIDE BRANCH", label: "Parkside" },
    { name: "PORTOLA BRANCH", label: "Portola" },
    { name: "POTRERO BRANCH", label: "Potrero" },
    { name: "PRESIDIO BRANCH", label: "Presidio" },
    {
      name: "PUBLIC KNOWLEDGE BRANCH (SFMOMA)",
      label: "Public Knowledge Branch (SFMOMA)"
    },
    { name: "RICHMOND BRANCH", label: "Richmond" },
    { name: "SUNSET BRANCH", label: "Sunset" },
    { name: "VISITACION VALLEY BRANCH", label: "Visitacion Valley" },
    { name: "WEST PORTAL BRANCH", label: "West Portal" },
    { name: "WESTERN ADDITION BRANCH", label: "Western Addition" }
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
