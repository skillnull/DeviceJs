#!/bin/sh
  git filter-branch --env-filter '
  OLD_EMAIL="skillisnull@gmail.com"
  NEW_NAME="skillnull"
  NEW_EMAIL="skillisnull@gmail.com"
  if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
  then
  export GIT_COMMITTER_NAME="$NEW_NAME"
  export GIT_COMMITTER_EMAIL="$NEW_EMAIL"
  fi
  if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
  then
  export GIT_AUTHOR_NAME="$NEW_NAME"
  export GIT_AUTHOR_EMAIL="$NEW_EMAIL"
  fi
  ' --tag-name-filter cat -- --branches --tags