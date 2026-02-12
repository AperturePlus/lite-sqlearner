!include "FileFunc.nsh"

!macro EnsureInstallSubdir
  ${If} $INSTDIR != ""
    ${GetFileName} "$INSTDIR" $0
    ${If} $0 != "${APP_FILENAME}"
      StrCpy $INSTDIR "$INSTDIR\${APP_FILENAME}"
    ${EndIf}
  ${EndIf}
!macroend

!macro customInit
  !insertmacro EnsureInstallSubdir
!macroend
