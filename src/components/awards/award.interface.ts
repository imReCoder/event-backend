// you can move this interface at any common place
// for now I wil stick with in components flow.

export interface INomination {
  name: string;
  name_hindi: string;
  image: string;
  ytlink: string;
  ytlink_hindi: string;
  weblink: string;
  weblink_hindi: string;
  key: number;
}
export interface IJury {
  name: string;
  name_hindi: string;
  image: string;
  comments: string;
  comments_hindi: string;
  medialink: string;
  medialink_hindi: string;
  key: number;
  organization: string,
  designation: string
}

export interface IAward {
  language_hindi: boolean;
  language_english: boolean;
  user: string;

  categoryId: string;
  hidden: boolean;
  heading: string;
  heading_hindi: string;
  expiredHeading: string;
  expiredHeading_hindi: string;
  awardvideo: string;
  image: string;
  jurys: IJury[];
  nominations: INomination[];
  lifeSpan: Date;
  juryWeightage: number;
  audienceWeightage: number;
  category: string,
  subcategory?: string,
}

export interface IAwardAnswerMetadata {
  age: number;
  gender: string;
  region: string;
  subRegion: string;
}

export interface IAwardAnswer {
  user: string,
  award: string,
  answer: number,
  comment: string,
  metadata: IAwardAnswerMetadata
}

export interface IAwardResult {
  award: string;
  vote: any;
  options: any;
  last_count: number;
  region_filter: boolean;
}

