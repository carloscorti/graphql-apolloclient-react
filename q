warning: LF will be replaced by CRLF in api/data/speakers.json.
The file will have its original line endings in your working directory
warning: LF will be replaced by CRLF in app/src/pages/conference/Speakers.jsx.
The file will have its original line endings in your working directory
[1mdiff --git a/api/data/speakers.json b/api/data/speakers.json[m
[1mindex bceabf1..8accb59 100644[m
[1m--- a/api/data/speakers.json[m
[1m+++ b/api/data/speakers.json[m
[36m@@ -37,7 +37,8 @@[m
           "name": "GraphQL - The Big Picture"[m
         }[m
       ],[m
[31m-      "name": "West Larson"[m
[32m+[m[32m      "name": "West Larson",[m
[32m+[m[32m      "featured": true[m
     },[m
     {[m
       "id": "1491c981-bbb2-4db3-b89a-3a7434451fed",[m
[36m@@ -48,7 +49,8 @@[m
           "name": "Rapid Cross-Platform AR Development with React Native"[m
         }[m
       ],[m
[31m-      "name": "Xoan Chapman"[m
[32m+[m[32m      "name": "Xoan Chapman",[m
[32m+[m[32m      "featured": true[m
     },[m
     {[m
       "id": "223d2b9d-a582-4e14-bebb-d636fb030bda",[m
[36m@@ -70,7 +72,8 @@[m
           "name": "Building a QA practice from scratch"[m
         }[m
       ],[m
[31m-      "name": "Ripley Vargas"[m
[32m+[m[32m      "name": "Ripley Vargas",[m
[32m+[m[32m      "featured": true[m
     },[m
     {[m
       "id": "e8eb22dd-d167-4efa-ba0e-905c94b38f9b",[m
[36m@@ -118,7 +121,8 @@[m
           "name": "Just because you can do something, doesn't mean you should!"[m
         }[m
       ],[m
[31m-      "name": "Edward Brown"[m
[32m+[m[32m      "name": "Edward Brown",[m
[32m+[m[32m      "featured": true[m
     },[m
     {[m
       "id": "fdf3c776-f100-41f5-bb22-7a1f16710740",[m
[36m@@ -239,7 +243,8 @@[m
           "name": "Practical Grid: Get Started with CSS Grid in Practical, Reusable Components"[m
         }[m
       ],[m
[31m-      "name": "Ocean Kelley"[m
[32m+[m[32m      "name": "Ocean Kelley",[m
[32m+[m[32m      "featured": true[m
     },[m
     {[m
       "id": "7f695e1c-2165-4a1e-a3e7-0204cf9cb173",[m
[36m@@ -976,7 +981,8 @@[m
           "name": "Azure Pipelines from Scratch"[m
         }[m
       ],[m
[31m-      "name": "Memphis White"[m
[32m+[m[32m      "name": "Memphis White",[m
[32m+[m[32m      "featured": true[m
     },[m
     {[m
       "id": "266b5537-0164-405b-bbf4-1acefbf4c9f5",[m
[1mdiff --git a/app/src/pages/conference/Speakers.jsx b/app/src/pages/conference/Speakers.jsx[m
[1mindex 4ddcba1..b27ed98 100644[m
[1m--- a/app/src/pages/conference/Speakers.jsx[m
[1m+++ b/app/src/pages/conference/Speakers.jsx[m
[36m@@ -1,7 +1,7 @@[m
 import * as React from "react";[m
 import "./style-sessions.css";[m
 import { useParams } from "react-router-dom";[m
[31m-import { gql, useQuery } from "@apollo/client";[m
[32m+[m[32mimport { gql, useQuery, useMutation } from "@apollo/client";[m
 [m
 /* ---> Define queries, mutations and fragments here */[m
 const SPEAKER_ATRIBUTES = gql`[m
[36m@@ -13,6 +13,16 @@[m [mconst SPEAKER_ATRIBUTES = gql`[m
       id[m
       title[m
     }[m
[32m+[m[32m    featured[m
[32m+[m[32m  }[m
[32m+[m[32m`;[m
[32m+[m
[32m+[m[32mconst FEATURED_SPEAKER = gql`[m
[32m+[m[32m  mutation markFeatured($speakerId: ID!, $featured: Boolean!) {[m
[32m+[m[32m    markFeatured(speakerId: $speakerId, featured: $featured) {[m
[32m+[m[32m      id[m
[32m+[m[32m      featured[m
[32m+[m[32m    }[m
   }[m
 `;[m
 [m
[36m@@ -35,6 +45,7 @@[m [mconst SPEAKER_BY_ID = gql`[m
 `;[m
 [m
 const SpeakerList = () => {[m
[32m+[m[32m  const [markFeatured] = useMutation(FEATURED_SPEAKER);[m
   const { loading, error, data } = useQuery(SPEAKERS);[m
 [m
   if (loading) return <p>Loading Speakers...</p>;[m
[36m@@ -43,7 +54,7 @@[m [mconst SpeakerList = () => {[m
 [m
   const featured = false;[m
 [m
[31m-  return data.speakers.map(({ id, name, bio, sessions }) => ([m
[32m+[m[32m  return data.speakers.map(({ id, name, bio, sessions, featured }) => ([m
     <div[m
       key={id}[m
       className="col-xs-12 col-sm-6 col-md-6"[m
[36m@@ -67,8 +78,10 @@[m [mconst SpeakerList = () => {[m
             <button[m
               type="button"[m
               className="btn btn-default btn-lg"[m
[31m-              onClick={() => {[m
[31m-                /* ---> Call useMutation's mutate function to mark speaker as featured */[m
[32m+[m[32m              onClick={async () => {[m
[32m+[m[32m                await markFeatured({[m
[32m+[m[32m                  variables: { speakerId: id, featured: true },[m
[32m+[m[32m                });[m
               }}[m
             >[m
               <i[m
