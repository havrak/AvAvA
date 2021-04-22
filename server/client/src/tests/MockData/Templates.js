import {images} from './Images';

export const templates = {
   Ubuntu: {
      id: 44,
      name: "Ubuntu",
      createdOn: {},
      image: images.Ubuntu,
      description: "default profile for users with Ubuntu image",
      minDiskUsage: 180000000,
   },
   Debian: {
      id: 45,
      name: "Debian",
      createdOn: {},
      image: images.Debian,
      description: "default profile for users with Debian image",
      minDiskUsage: 190000000,
   },
};