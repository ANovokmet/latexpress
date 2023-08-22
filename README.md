# latexpress

Generate a CV from a predefined template and your data. Define new templates from Latex templates.

This is an app with the frontend in Svelte and NodeJS backend.

# Idea

There are a lot of latex cv templates available, but more knowledge is needed to work with latex source files. 
This app displays all the data that can be updated as text inputs, eliminating the need for users to know latex.
Before a CV could be generated, the latex template should be updated in a way to allow latexpress to know which fields exist and which data should be inserted.
Because I used handlebars as a templating engine, and latex files are `.tex`, the new file type is `.texbars`. 
Anywhere a field should be entered in a `.tex` file, eg. "first name", the template should contain a handlebars notation.

For example:

`template1.tex`:
```
\cvname{Alice} % Your name
```

`template1.texbars`:
```
\cvname{<%= personalDetails.name %>} % Your name
```

This is the app developer's job. 
When latexpress reads the `.texbars` file, it now knows there should be a section called `personalDetails` with the field `name`.
And later when a user enters the name, it enters the user name in the appropriate place.

`.texbars` support handlebars completely, for example repeats:

```
\section{Publications}

\begin{twentyshort} % Environment for a short list with no descriptions
	<%=#each publications %>\twentyitemshort{<%= dates %>}{<%= title %>}<%=/each%>
\end{twentyshort}
```

Meaning there is a list of publications where each item has "dates" and "title" properties.
