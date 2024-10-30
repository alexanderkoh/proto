interface RCSBSearchResult {
  identifier: string;
  title: string;
  experimental_method: string[];
  release_date: string;
}

interface RCSBResponse {
  result_set: RCSBSearchResult[];
} 