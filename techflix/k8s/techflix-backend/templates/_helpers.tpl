{{/*
Expand the name of the chart.
*/}}
{{- define "techflix-backend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "techflix-backend.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "techflix-backend.labels" -}}
helm.sh/chart: {{ include "techflix-backend.name" . }}-{{ .Chart.Version | replace "+" "_" }}
{{ include "techflix-backend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "techflix-backend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "techflix-backend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app: {{ include "techflix-backend.fullname" . }}
{{- end }}